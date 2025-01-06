'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

const predefinedTags = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js',
  'Machine Learning', 'Web Development', 'Data Science', 'Algorithms'
]

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [customTag, setCustomTag] = useState('')

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag])
    }
    setCustomTag('')
  }

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <Button
            key={tag}
            variant="secondary"
            size="sm"
            onClick={() => removeTag(tag)}
            className="flex items-center gap-1"
          >
            {tag}
            <X className="h-3 w-3" />
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add custom tag"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag(customTag)
            }
          }}
        />
        <Button onClick={() => addTag(customTag)}>Add</Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {predefinedTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={() => addTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  )
}

