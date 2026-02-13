import { useState } from 'react'
import { useData } from '../context/DataContext'
import { supabase } from '../lib/supabase'

function SiteManager() {
    const { data, updateSiteSetting, addBanner, updateBanner, deleteBanner, loading } = useData()
    const [uploading, setUploading] = useState(false)
    const [newBannerTitle, setNewBannerTitle] = useState('')

    // --- LOGO MANAGEMENT ---
    const handleLogoUpload = async (event) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `logo-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('site-assets')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('site-assets')
                .getPublicUrl(filePath)

            await updateSiteSetting('site_logo', publicUrl)
            alert('Logo updated successfully!')

        } catch (error) {
            alert('Error uploading logo: ' + error.message)
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    // --- BANNER MANAGEMENT ---
    const handleBannerUpload = async (event) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `banner-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('site-assets')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data: { publicUrl } } = supabase.storage
                .from('site-assets')
                .getPublicUrl(filePath)

            // Add new banner
            await addBanner({
                image_url: publicUrl,
                title: newBannerTitle,
                sort_order: data.banners.length + 1,
                is_active: true
            })

            setNewBannerTitle('')
            alert('Banner added successfully!')

        } catch (error) {
            alert('Error uploading banner: ' + error.message)
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const toggleBannerActive = (banner) => {
        updateBanner(banner.id, { is_active: !banner.is_active })
    }

    const deleteBannerItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            await deleteBanner(id)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="admin-content">
            <header className="admin-header">
                <h2>Site Settings</h2>
            </header>

            {/* --- LOGO SECTION --- */}
            <section style={{ marginBottom: '3rem', background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>Site Logo</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '1rem' }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        border: '2px dashed #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        borderRadius: '8px'
                    }}>
                        {data.siteSettings?.site_logo ? (
                            <img
                                src={data.siteSettings.site_logo}
                                alt="Site Logo"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        ) : (
                            <span style={{ color: '#999' }}>No Logo</span>
                        )}
                    </div>
                    <div>
                        <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                            Upload a new logo to replace the current one. Preferred format: PNG or SVG.
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploading}
                            id="logo-upload"
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="logo-upload"
                            className="btn-primary"
                            style={{ display: 'inline-block', cursor: uploading ? 'not-allowed' : 'pointer' }}
                        >
                            {uploading ? 'Uploading...' : 'Upload New Logo'}
                        </label>
                    </div>
                </div>
            </section>

            {/* --- HERO BANNERS SECTION --- */}
            <section style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3>Hero Banners</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                    Upload up to 4 banners. These will rotate automatically every 5 seconds on the homepage.
                </p>

                {/* Add New Banner */}
                <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '6px' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Add New Banner</h4>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Banner Title (Optional)</label>
                            <input
                                type="text"
                                value={newBannerTitle}
                                onChange={(e) => setNewBannerTitle(e.target.value)}
                                placeholder="Enter a title for the banner"
                                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                disabled={uploading || !newBannerTitle}
                                id="banner-upload"
                                style={{ display: 'none' }}
                            />
                            <label
                                htmlFor="banner-upload"
                                className="btn-secondary"
                                style={{ display: 'inline-block', cursor: (uploading || !newBannerTitle) ? 'not-allowed' : 'pointer', opacity: !newBannerTitle ? 0.6 : 1 }}
                            >
                                {uploading ? 'Uploading...' : 'Upload & Add'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Banner List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {data.banners?.map((banner) => (
                        <div key={banner.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ height: '120px', overflow: 'hidden', background: '#f0f0f0' }}>
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {banner.title || 'Untitled'}
                                </h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => toggleBannerActive(banner)}
                                        style={{
                                            padding: '0.3rem 0.6rem',
                                            fontSize: '0.75rem',
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: banner.is_active ? '#e6fffa' : '#fff5f5',
                                            color: banner.is_active ? '#047481' : '#c53030',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {banner.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                    <button
                                        onClick={() => deleteBannerItem(banner.id)}
                                        style={{ color: '#c53030', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.banners || data.banners.length === 0) && (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>No banners added yet.</p>
                    )}
                </div>
            </section>
        </div>
    )
}

export default SiteManager
