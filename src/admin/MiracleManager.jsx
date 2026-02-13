import { useState } from 'react'
import { useData } from '../context/DataContext'
import { Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function MiracleManager() {
    const { data, addMiracle, updateMiracle, deleteMiracle } = useData()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [uploading, setUploading] = useState({ image: false, audio: false })
    const [formData, setFormData] = useState({
        quote: '',
        image: '',
        title: '',
        artist: '',
        audio: '',
        youtubelink: ''
    })

    const getImageUrl = (url) => {
        if (!url) return ''
        if (url.includes('drive.google.com')) {
            const idMatch = url.match(/[-\w]{25,}/)
            if (idMatch) {
                return `https://docs.google.com/uc?export=download&id=${idMatch[0]}`
            }
        }
        return url
    }

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploading(prev => ({ ...prev, [type]: true }))

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${type}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, [type]: publicUrl }))
            alert(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`)
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Error uploading file. Make sure the "assets" bucket exists in Supabase Storage with public access.')
        } finally {
            setUploading(prev => ({ ...prev, [type]: false }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (editingId) {
            updateMiracle(editingId, formData)
            setEditingId(null)
        } else {
            addMiracle(formData)
            setIsAdding(false)
        }
        setFormData({ quote: '', image: '', title: '', artist: '', audio: '', youtubelink: '' })
    }

    const handleEdit = (miracle) => {
        setEditingId(miracle.id)
        setFormData({
            quote: miracle.quote,
            image: miracle.image,
            title: miracle.title,
            artist: miracle.artist,
            audio: miracle.audio || '',
            youtubelink: miracle.youtubelink || ''
        })
        setIsAdding(true)
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({ quote: '', image: '', title: '', artist: '', audio: '', youtubelink: '' })
    }

    return (
        <div className="content-manager">
            <div className="manager-header">
                <h1>Miracle Manager</h1>
                {!isAdding && (
                    <button className="btn-primary" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Add Miracle
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3>{editingId ? 'Edit Miracle' : 'Add New Miracle'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Story name</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., A Story of Karthick"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    value={formData.artist}
                                    onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                    placeholder="e.g., Sri Amma Bhagavan"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Quotes</label>
                            <textarea
                                value={formData.quote}
                                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                placeholder="Testimonial quote"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Image upload</label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'image')}
                                        disabled={uploading.image}
                                        id="image-upload"
                                        className="file-input-hidden"
                                    />
                                    <label htmlFor="image-upload" className="btn-file">
                                        <Upload size={18} /> {uploading.image ? 'Uploading...' : 'Choose Image'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.image || ''}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="Or paste Image URL"
                                    />
                                </div>
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="image-preview" style={{ marginTop: '10px', maxHeight: '100px', borderRadius: '8px' }} />
                                )}
                            </div>

                            <div className="form-group">
                                <label>Audio upload</label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => handleFileUpload(e, 'audio')}
                                        disabled={uploading.audio}
                                        id="audio-upload"
                                        className="file-input-hidden"
                                    />
                                    <label htmlFor="audio-upload" className="btn-file">
                                        <Upload size={18} /> {uploading.audio ? 'Uploading...' : 'Choose Audio'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.audio || ''}
                                        onChange={(e) => setFormData({ ...formData, audio: e.target.value })}
                                        placeholder="Or paste Audio URL"
                                    />
                                </div>
                                {formData.audio && (
                                    <div className="audio-preview-hint">Audio loaded: {formData.audio.split('/').pop()}</div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>YouTube Link (Optional)</label>
                            <input
                                type="text"
                                value={formData.youtubelink || ''}
                                onChange={(e) => setFormData({ ...formData, youtubelink: e.target.value })}
                                placeholder="e.g., https://youtube.com/watch?v=..."
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Save size={18} /> {editingId ? 'Update' : 'Add'} Miracle
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
                            <th>Artist</th>
                            <th>Quote</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.miracles.map(miracle => (
                            <tr key={miracle.id}>
                                <td>{miracle.id}</td>
                                <td>{miracle.title}</td>
                                <td>{miracle.artist}</td>
                                <td className="quote-cell">{miracle.quote.substring(0, 50)}...</td>
                                <td>
                                    <img src={getImageUrl(miracle.image)} alt={miracle.title} className="table-thumbnail" />
                                </td>
                                <td className="actions">
                                    <button className="btn-edit" onClick={() => handleEdit(miracle)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="btn-delete" onClick={() => deleteMiracle(miracle.id)}>
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
