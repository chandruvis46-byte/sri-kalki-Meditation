import { useState } from 'react'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'

export default function CategoryManager() {
    const { data, addCategory, updateCategory, deleteCategory } = useData()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ name: '', icon: '' })
    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `categories/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, icon: publicUrl }))
            alert('Icon uploaded successfully!')
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Error uploading icon. Make sure the "assets" bucket exists in Supabase Storage with public access.')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editingId) {
            await updateCategory(editingId, formData)
            setEditingId(null)
        } else {
            await addCategory(formData)
            setIsAdding(false)
        }
        setFormData({ name: '', icon: '' })
    }

    const handleEdit = (category) => {
        setEditingId(category.id)
        setFormData({ name: category.name, icon: category.icon })
        setIsAdding(true)
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({ name: '', icon: '' })
    }

    return (
        <div className="content-manager">
            <div className="manager-header">
                <h1>Category Manager</h1>
                {!isAdding && (
                    <button className="btn-primary" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Add Category
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3>{editingId ? 'Edit Category' : 'Add New Category'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Talks"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Category Icon</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="file-input-hidden"
                                    id="icon-upload"
                                />
                                <label htmlFor="icon-upload" className="btn-file">
                                    {uploading ? 'Uploading...' : 'Choose Icon'}
                                </label>
                                {formData.icon && (
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        readOnly
                                        placeholder="Icon URL"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Save size={18} /> {editingId ? 'Update' : 'Add'} Category
                            </button>
                            <button type="button" className="btn-secondary" onClick={handleCancel}>
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="data-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <img src={category.icon} alt={category.name} className="table-icon" />
                                </td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => handleEdit(category)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="btn-delete" onClick={() => deleteCategory(category.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
