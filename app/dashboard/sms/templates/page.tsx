'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface SMSTemplate {
  id: string
  name: string
  template_key: string
  message_content: string
  variables_used: string[]
  is_active: boolean
}

export default function SMSTemplatesPage() {
  const [templates, setTemplates] = useState<SMSTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/sms/templates')
      const data = await response.json()
      setTemplates(data.data || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTemplate = async (templateId: string) => {
    try {
      const response = await fetch('/api/sms/templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: templateId,
          message_content: editContent,
        }),
      })

      if (response.ok) {
        alert('Template saved successfully!')
        setEditingId(null)
        fetchTemplates()
      }
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">SMS Templates</h1>

      {loading ? (
        <p>Loading templates...</p>
      ) : (
        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-sm text-muted-foreground">Key: {template.template_key}</p>
              </div>

              {editingId === template.id ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full p-3 border rounded-md font-mono text-sm"
                    rows={6}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveTemplate(template.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{template.message_content}</p>
                  </div>
                  {template.variables_used.length > 0 && (
                    <div className="text-sm">
                      <p className="font-medium mb-2">Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.variables_used.map((variable) => (
                          <code
                            key={variable}
                            className="bg-blue-100 text-blue-900 px-2 py-1 rounded text-xs"
                          >
                            {'{' + variable + '}'}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        template.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(template.id)
                        setEditContent(template.message_content)
                      }}
                    >
                      Edit Template
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Card className="p-6 bg-blue-50">
        <h3 className="font-semibold mb-3">Variable Reference</h3>
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <p><code>{'{customer_name}'}</code> - User first name</p>
          <p><code>{'{amount}'}</code> - Transaction amount</p>
          <p><code>{'{expiry_date}'}</code> - Subscription end date</p>
          <p><code>{'{company_name}'}</code> - ISP company name</p>
        </div>
      </Card>
    </div>
  )
}
