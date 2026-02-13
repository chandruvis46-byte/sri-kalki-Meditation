import { useState } from 'react'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react'

export default function CollectionManager() {
    const { data, addCollection, updateCollection, deleteCollection } = useData()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ title: '', sessions: '', image: '' })
    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `collections/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, image: publicUrl }))
            alert('Image uploaded successfully!')
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Error uploading image. Make sure the "assets" bucket exists in Supabase Storage with public access.')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const collectionData = { ...formData, sessions: parseInt(formData.sessions) }
        if (editingId) {
            await updateCollection(editingId, collectionData)
            setEditingId(null)
        } else {
            await addCollection(collectionData)
            setIsAdding(false)
        }
        setFormData({ title: '', sessions: '', image: '' })
    }

    const handleEdit = (collection) => {
        setEditingId(collection.id)
        setFormData({ title: collection.title, sessions: collection.sessions, image: collection.image })
        setIsAdding(true)
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({ title: '', sessions: '', image: '' })
    }

    return (
        <div className="content-manager">
            <div className="manager-header">
                <h1>Collection Manager</h1>
                {!isAdding && (
                    <button className="btn-primary" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Add Collection
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3>{editingId ? 'Edit Collection' : 'Add New Collection'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Collection Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Morning Clarity"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Number of Sessions</label>
                            <input
                                type="number"
                                value={formData.sessions}
                                onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                                placeholder="e.g., 12"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Collection Image</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="file-input-hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="btn-file">
                                    {uploading ? 'Uploading...' : 'Choose Image'}
                                </label>
                                {formData.image && (
                                    <input
                                        type="text"
                                        value={formData.image}
                                        readOnly
                                        placeholder="Image URL"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Save size={18} /> {editingId ? 'Update' : 'Add'} Collection
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
                            <th>Title</th>
                            <th>Sessions</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.collections.map(collection => (
                            <tr key={collection.id}>
                                <td>{collection.id}</td>
                                <td>{collection.title}</td>
                                <td>{collection.sessions}</td>
                                <td>
                                    <img src={collection.image} alt={collection.title} className="table-thumbnail" />
                                </td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => handleEdit(collection)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="btn-delete" onClick={() => deleteCollection(collection.id)}>
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
