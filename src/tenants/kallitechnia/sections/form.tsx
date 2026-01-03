'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { renderLexicalContent, type LexicalDocument, type LexicalNode } from '@/lib/lexical'
import { getFormBySlug, submitForm, type Form } from '@/lib/api'
import { useRouter } from 'next/navigation'

/**
 * DESIGN-LOCKED Form Section
 * 
 * CMS provides: form (relationship), title, description
 * Frontend controls: ALL spacing, sizing, layout, typography
 */
interface FormProps {
  form?: string | { id: string; slug: string; name: string } | null
  title?: string
  description?: LexicalDocument | LexicalNode[] | string | null
}

export function KallitechniaForm({ form, title, description }: FormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Form | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // Extract form - can be: string (ID), object with slug/id, or already populated form object
  const formSlugOrId =
    typeof form === 'string'
      ? form
      : form && typeof form === 'object'
        ? (form as any).slug || (form as any).id || (form as any)._id || null
        : null

  // Check if form is already populated with fields (from CMS depth=2)
  const isFormPopulated =
    form &&
    typeof form === 'object' &&
    'fields' in form &&
    Array.isArray((form as any).fields)

  // Fetch form data if not already populated
  useEffect(() => {
    if (isFormPopulated) {
      // Form is already populated, use it directly
      const populatedForm = form as any
      if (populatedForm.status === 'active') {
        setFormData({
          id: populatedForm.id || populatedForm._id,
          name: populatedForm.name,
          slug: populatedForm.slug,
          fields: populatedForm.fields || [],
          successMessage: populatedForm.successMessage,
          redirectUrl: populatedForm.redirectUrl,
          status: populatedForm.status,
        })
        // Initialize form values
        const initialValues: Record<string, any> = {}
        populatedForm.fields.forEach((field: any) => {
          if (field.type === 'checkbox') {
            initialValues[field.name] = false
          } else {
            initialValues[field.name] = ''
          }
        })
        setFormValues(initialValues)
      }
      return
    }

    if (!formSlugOrId) {
      return
    }

    // Fetch form by slug or ID
    getFormBySlug(formSlugOrId)
      .then((fetchedForm) => {
        if (fetchedForm) {
          setFormData(fetchedForm)
          // Initialize form values
          const initialValues: Record<string, any> = {}
          fetchedForm.fields.forEach((field) => {
            if (field.type === 'checkbox') {
              initialValues[field.name] = false
            } else {
              initialValues[field.name] = ''
            }
          })
          setFormValues(initialValues)
        } else {
          console.warn('[Form] Form not found by slug/ID:', formSlugOrId)
        }
      })
      .catch((error) => {
        console.error('[Form] Error fetching form:', error)
      })
  }, [formSlugOrId, isFormPopulated, form])

  if (!formData) {
    return null
  }

  const safeTitle = title || formData.name || ''
  const safeDescription = description || null

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitStatus({ type: null, message: '' })
    setIsSubmitting(true)

    // Client-side validation
    const validationErrors: Record<string, string> = {}
    formData.fields.forEach((field) => {
      const value = formValues[field.name]
      if (field.required && (!value || value === '' || (field.type === 'checkbox' && !value))) {
        validationErrors[field.name] = `${field.label} is required`
      }
      if (value && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          validationErrors[field.name] = `${field.label} must be a valid email`
        }
      }
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    // Submit form (use form slug from fetched form data)
    const result = await submitForm(formData.slug, formValues)

    if (result.success) {
      setSubmitStatus({
        type: 'success',
        message: result.message || 'Thank you! Your submission has been received.',
      })

      // Redirect if URL provided
      if (result.redirectUrl) {
        const redirectUrl = result.redirectUrl
        setTimeout(() => {
          if (redirectUrl.startsWith('http')) {
            window.location.href = redirectUrl
          } else {
            router.push(redirectUrl)
          }
        }, 2000)
      } else {
        // Reset form after 3 seconds
        setTimeout(() => {
          const initialValues: Record<string, any> = {}
          formData.fields.forEach((field) => {
            if (field.type === 'checkbox') {
              initialValues[field.name] = false
            } else {
              initialValues[field.name] = ''
            }
          })
          setFormValues(initialValues)
          setSubmitStatus({ type: null, message: '' })
        }, 3000)
      }
    } else {
      setSubmitStatus({
        type: 'error',
        message: result.message || 'Failed to submit form. Please try again.',
      })
      if (result.errors) {
        setErrors(result.errors)
      }
    }

    setIsSubmitting(false)
  }

  const renderField = (field: Form['fields'][0]) => {
    const value = formValues[field.name] || ''
    const error = errors[field.name]
    const fieldId = `field-${field.name}`

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              name={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value ? String(value) : ''}
              onValueChange={(val) => handleChange(field.name, val)}
              required={field.required}
            >
              <SelectTrigger id={fieldId} className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || 'Select an option'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-start space-x-2">
            <Checkbox
              id={fieldId}
              name={field.name}
              checked={value}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
              required={field.required}
            />
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {error && <p className="text-sm text-red-500 ml-6">{error}</p>}
          </div>
        )

      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              name={field.name}
              type="number"
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              name={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
    }
  }

  return (
    <section className="py-20 bg-background fade-in-section opacity-0">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {safeTitle && (
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-balance">
              {safeTitle}
            </h2>
          )}
          {safeDescription && (
            <div className="mb-8 text-center text-muted-foreground">
              {renderLexicalContent(safeDescription)}
            </div>
          )}

          {submitStatus.type === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {submitStatus.message}
            </div>
          )}

          {submitStatus.type === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.fields.map((field) => renderField(field))}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white hover:bg-primary/90"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
