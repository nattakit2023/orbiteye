import React from 'react'

interface ResolutionProps {
  onSelectItem?: (itemId: string) => void;
  selectedItems?: string[];
}

const Resolution: React.FC<ResolutionProps> = ({ onSelectItem, selectedItems = [] }) => {
  const resolutionData = [
    { id: '1', label: '1920x1080', value: 'Full HD' },
    { id: '2', label: '1280x720', value: 'HD' },
    { id: '3', label: '2560x1440', value: '2K' },
    { id: '4', label: '3840x2160', value: '4K' },
    { id: '5', label: '1024x768', value: 'XGA' },
    { id: '6', label: '800x600', value: 'SVGA' },
    { id: '7', label: '2048x1536', value: 'QXGA' },
    { id: '8', label: '1600x1200', value: 'UXGA' },
    { id: '9', label: '7680x4320', value: '8K' },
    { id: '10', label: '5120x2880', value: '5K' },
  ]

  return (
    <div className="w-full">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {resolutionData.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem?.(item.id)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: selectedItems.includes(item.id) ? '2px solid #1890ff' : '1px solid #d9d9d9',
              backgroundColor: selectedItems.includes(item.id) ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#FFFFFF', fontSize: '14px' }}>
              {item.label}
            </p>
            <p style={{ margin: 0, color: '#999999', fontSize: '12px' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Resolution