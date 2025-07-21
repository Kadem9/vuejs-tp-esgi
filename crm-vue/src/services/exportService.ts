import type { Customer, Interaction } from '@/types'

// export clients en csv
export const exportCustomersToCSV = (customers: readonly Customer[]) => {
  const headers = ['id', 'name', 'email', 'phone', 'company', 'status', 'notes', 'createdAt', 'updatedAt']
  const csvContent = [
    headers.join(','),
    ...customers.map(customer => [
      customer.id,
      `"${customer.name}"`,
      customer.email,
      customer.phone || '',
      `"${customer.company || ''}"`,
      customer.status,
      `"${customer.notes || ''}"`,
      customer.createdAt,
      customer.updatedAt
    ].join(','))
  ].join('\n')

  downloadCSV(csvContent, 'customers.csv')
}

// export interactions en csv
export const exportInteractionsToCSV = (interactions: readonly Interaction[]) => {
  const headers = ['id', 'title', 'type', 'description', 'status', 'priority', 'date', 'customerName', 'userName', 'createdAt']
  const csvContent = [
    headers.join(','),
    ...interactions.map(interaction => [
      interaction.id,
      `"${interaction.title}"`,
      interaction.type,
      `"${interaction.description || ''}"`,
      interaction.status,
      interaction.priority,
      interaction.date,
      `"${interaction.customer?.name || ''}"`,
      `"${interaction.user?.name || ''}"`,
      interaction.createdAt
    ].join(','))
  ].join('\n')

  downloadCSV(csvContent, 'interactions.csv')
}

// télécharger fichier csv
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// parser fichier csv
export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// valider données clients
export const validateCustomerData = (data: any[]): { valid: any[], errors: string[] } => {
  const valid: any[] = []
  const errors: string[] = []
  
  data.forEach((row, index) => {
    if (!row.name || !row.email) {
      errors.push(`ligne ${index + 1}: nom et email requis`)
      return
    }
    
    if (!row.email.includes('@')) {
      errors.push(`ligne ${index + 1}: email invalide`)
      return
    }
    
    valid.push({
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      company: row.company || '',
      status: row.status || 'prospect',
      notes: row.notes || ''
    })
  })
  
  return { valid, errors }
}

// valider données interactions
export const validateInteractionData = (data: any[]): { valid: any[], errors: string[] } => {
  const valid: any[] = []
  const errors: string[] = []
  
  data.forEach((row, index) => {
    if (!row.title || !row.type) {
      errors.push(`ligne ${index + 1}: titre et type requis`)
      return
    }
    
    const validTypes = ['call', 'email', 'meeting', 'note', 'task']
    if (!validTypes.includes(row.type)) {
      errors.push(`ligne ${index + 1}: type invalide (${validTypes.join(', ')})`)
      return
    }
    
    valid.push({
      title: row.title,
      type: row.type,
      description: row.description || '',
      status: row.status || 'pending',
      priority: row.priority || 'medium',
      date: row.date ? new Date(row.date) : new Date()
    })
  })
  
  return { valid, errors }
} 