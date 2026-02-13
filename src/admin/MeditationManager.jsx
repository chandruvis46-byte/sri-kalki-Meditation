import { useState } from 'react'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'
import { Plus, Pencil, Trash2, Save, X, Music, Video, Image as ImageIcon } from 'lucide-react'

export default function MeditationManager() {
    const { data, addMeditation, updateMeditation, deleteMeditation, addEpisode, updateEpisode, deleteEpisode } = useData()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ title: '', description: '', image: '', duration: '' })
    const [uploading, setUploading] = useState(false)

    // Episode Management State
    const [showEpisodes, setShowEpisodes] = useState(false)
    const [selectedMeditation, setSelectedMeditation] = useState(null)
    const [episodeForm, setEpisodeForm] = useState({
        title: '',
        description: '',
        image: '',
        media_type: 'video',
        media_url: '',
        duration: ''
    })
    const [editingEpisodeId, setEditingEpisodeId] = useState(null)

    const handleFileUpload = async (e, type = 'meditations') => {
        const file = e.target.files[0]
        if (!file) return

        try {
            setUploading(true)
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

            if (type === 'episodes') {
                return publicUrl
            } else {
                setFormData(prev => ({ ...prev, image: publicUrl }))
                alert('Image uploaded successfully!')
            }
        } catch (error) {
            console.error('Error uploading:', error)
            alert('Error uploading file.')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (editingId) {
            await updateMeditation(editingId, formData)
            setEditingId(null)
        } else {
            await addMeditation(formData)
            setIsAdding(false)
        }
        setFormData({ title: '', description: '', image: '', duration: '' })
    }

    const handleEdit = (meditation) => {
        setEditingId(meditation.id)
        setFormData(meditation)
        setIsAdding(true)
    }

    const handleCancel = () => {
        setIsAdding(false)
        setEditingId(null)
        setFormData({ title: '', description: '', image: '', duration: '' })
    }

    // Episode Functions
    const handleManageEpisodes = (meditation) => {
        setSelectedMeditation(meditation)
        setShowEpisodes(true)
    }

    const handleEpisodeSubmit = async (e) => {
        e.preventDefault()
        const epiData = { ...episodeForm, meditation_id: selectedMeditation.id }
        if (editingEpisodeId) {
            await updateEpisode(editingEpisodeId, epiData)
            setEditingEpisodeId(null)
        } else {
            await addEpisode(epiData)
        }
        setEpisodeForm({
            title: '',
            description: '',
            image: '',
            media_type: 'video',
            media_url: '',
            duration: ''
        })
    }

    const editEpisode = (epi) => {
        setEditingEpisodeId(epi.id)
        setEpisodeForm(epi)
    }

    if (showEpisodes && selectedMeditation) {
        const meditationEpisodes = data.episodes.filter(e => e.meditation_id === selectedMeditation.id)

        return (
            <div className="content-manager">
                <div className="manager-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button className="btn-secondary" onClick={() => setShowEpisodes(false)}>
                            <X size={18} /> Back
                        </button>
                        <h1>Manage Episodes: {selectedMeditation.title}</h1>
                    </div>
                </div>

                <div className="form-card">
                    <h3>{editingEpisodeId ? 'Edit Episode' : 'Add New Episode'}</h3>
                    <form onSubmit={handleEpisodeSubmit}>
                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={episodeForm.title}
                                    onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration</label>
                                <input
                                    type="text"
                                    value={episodeForm.duration}
                                    onChange={(e) => setEpisodeForm({ ...episodeForm, duration: e.target.value })}
                                    placeholder="e.g., 10:00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={episodeForm.description}
                                onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label>Media Type</label>
                                <select
                                    value={episodeForm.media_type}
                                    onChange={(e) => setEpisodeForm({ ...episodeForm, media_type: e.target.value })}
                                    className="select-input"
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    <option value="video">Video (YouTube)</option>
                                    <option value="audio">Audio (Upload)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>{episodeForm.media_type === 'video' ? 'YouTube URL' : 'Audio URL'}</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={episodeForm.media_url}
                                        onChange={(e) => setEpisodeForm({ ...episodeForm, media_url: e.target.value })}
                                        placeholder={episodeForm.media_type === 'video' ? 'YouTube link' : 'Audio link'}
                                        required
                                    />
                                    {episodeForm.media_type === 'audio' && (
                                        <div className="file-upload-wrapper" style={{ width: 'auto' }}>
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                onChange={async (e) => {
                                                    const url = await handleFileUpload(e, 'episodes')
                                                    if (url) setEpisodeForm(prev => ({ ...prev, media_url: url }))
                                                }}
                                                className="file-input-hidden"
                                                id="audio-upload"
                                            />
                                            <label htmlFor="audio-upload" className="btn-file" style={{ whiteSpace: 'nowrap' }}>
                                                Upload
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Episode Thumbnail (Optional)</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const url = await handleFileUpload(e, 'episodes')
                                        if (url) setEpisodeForm(prev => ({ ...prev, image: url }))
                                    }}
                                    className="file-input-hidden"
                                    id="episode-image-upload"
                                />
                                <label htmlFor="episode-image-upload" className="btn-file">
                                    Choose Image
                                </label>
                                <input
                                    type="text"
                                    value={episodeForm.image}
                                    readOnly
                                    placeholder="Image URL"
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Save size={18} /> {editingEpisodeId ? 'Update' : 'Add'} Episode
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => { setEditingEpisodeId(null); setEpisodeForm({ title: '', description: '', image: '', media_type: 'video', media_url: '', duration: '' }) }}>
                                <X size={18} /> Clear
                            </button>
                        </div>
                    </form>
                </div>

                <div className="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meditationEpisodes.map(epi => (
                                <tr key={epi.id}>
                                    <td>{epi.title}</td>
                                    <td>{epi.media_type === 'video' ? <Video size={16} /> : <Music size={16} />}</td>
                                    <td>{epi.duration}</td>
                                    <td className="actions">
                                        <button className="btn-edit" onClick={() => editEpisode(epi)}>
                                            <Pencil size={16} />
                                        </button>
                                        <button className="btn-delete" onClick={() => deleteEpisode(epi.id)}>
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

    return (
        <div className="content-manager">
            <div className="manager-header">
                <h1>Meditation Manager</h1>
                {!isAdding && (
                    <button className="btn-primary" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Add Meditation
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="form-card">
                    <h3>{editingId ? 'Edit Meditation' : 'Add New Meditation'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Chit Shakti for success"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Meditation Image</label>
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
                        <div className="form-group">
                            <label>Duration</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="e.g., 5 Episodes"
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Save size={18} /> {editingId ? 'Update' : 'Add'} Meditation
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
                            <th>Title</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.meditations.map(meditation => (
                            <tr key={meditation.id}>
                                <td>{meditation.title}</td>
                                <td>{meditation.description}</td>
                                <td>{meditation.duration}</td>
                                <td>
                                    <img src={meditation.image} alt={meditation.title} className="table-thumbnail" />
                                </td>
                                <td className="actions">
                                    <button className="btn-primary btn-sm" onClick={() => handleManageEpisodes(meditation)} title="Manage Episodes">
                                        Episodes
                                    </button>
                                    <button className="btn-edit" onClick={() => handleEdit(meditation)}>
                                        <Pencil size={16} />
                                    </button>
                                    <button className="btn-delete" onClick={() => deleteMeditation(meditation.id)}>
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

