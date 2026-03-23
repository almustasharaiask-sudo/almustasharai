'use client'

import { useState } from 'react'

interface Risk {
  level: 'low' | 'medium' | 'high'
  description: string
  recommendation: string
}

interface RiskTableProps {
  risks: Risk[]
  onCopy?: () => void
}

export default function RiskTable({ risks, onCopy }: RiskTableProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'high': return '⚠️'
      case 'medium': return '⚡'
      case 'low': return '✅'
      default: return 'ℹ️'
    }
  }

  const handleCopy = () => {
    const report = risks.map(risk =>
      `${getRiskIcon(risk.level)} ${risk.description}\nتوصية: ${risk.recommendation}`
    ).join('\n\n')

    navigator.clipboard.writeText(report)
    onCopy?.()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">جدول المخاطر</h3>
        <button
          onClick={handleCopy}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          نسخ التقرير
        </button>
      </div>

      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 ${getRiskColor(risk.level)}`}
          >
            <div className="flex items-start space-x-3 space-x-reverse">
              <span className="text-2xl">{getRiskIcon(risk.level)}</span>
              <div className="flex-1">
                <p className="font-medium mb-2">{risk.description}</p>
                <p className="text-sm opacity-90">
                  <strong>توصية:</strong> {risk.recommendation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {risks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد مخاطر محددة
        </div>
      )}
    </div>
  )
}