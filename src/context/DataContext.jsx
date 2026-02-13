import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DataContext = createContext()

export const useData = () => {
    const context = useContext(DataContext)
    if (!context) {
        throw new Error('useData must be used within DataProvider')
    }
    return context
}

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({
        categories: [],
        collections: [],
        meditations: [],
        miracles: [],
        episodes: []
    })
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // Initial data fetch
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true)
                const [
                    { data: categories, error: catErr },
                    { data: collections, error: colErr },
                    { data: meditations, error: medErr },
                    { data: miracles, error: mirErr },
                    { data: episodes, error: epiErr }
                ] = await Promise.all([
                    supabase.from('categories').select('*'),
                    supabase.from('collections').select('*'),
                    supabase.from('meditations').select('*'),
                    supabase.from('miracles').select('*'),
                    supabase.from('episodes').select('*')
                ])

                if (catErr || colErr || medErr || mirErr || epiErr) {
                    console.error('Fetch error:', { catErr, colErr, medErr, mirErr, epiErr })
                    alert('Error connecting to Supabase tables. Please ensure you have run the provided SQL script to create the required tables.')
                }

                setData({
                    categories: categories || [],
                    collections: collections || [],
                    meditations: meditations || [],
                    miracles: miracles || [],
                    episodes: episodes || []
                })
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAllData()
    }, [])

    // Categories CRUD
    const addCategory = async (category) => {
        const { data: newCategory, error } = await supabase
            .from('categories')
            .insert([category])
            .select()
        if (error) {
            console.error('Error adding category:', error)
            alert('Failed to add category. Please check if the "categories" table exists.')
            return
        }
        if (newCategory) {
            setData(prev => ({ ...prev, categories: [...prev.categories, newCategory[0]] }))
        }
    }

    const updateCategory = async (id, updates) => {
        const { error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
        if (error) {
            console.error('Error updating category:', error)
            alert('Failed to update category.')
            return
        }
        setData(prev => ({
            ...prev,
            categories: prev.categories.map(cat => cat.id === id ? { ...cat, ...updates } : cat)
        }))
    }

    const deleteCategory = async (id) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)
        if (error) {
            console.error('Error deleting category:', error)
            alert('Failed to delete category.')
            return
        }
        setData(prev => ({
            ...prev,
            categories: prev.categories.filter(cat => cat.id !== id)
        }))
    }

    // Collections CRUD
    const addCollection = async (collection) => {
        const { data: newCollection, error } = await supabase
            .from('collections')
            .insert([collection])
            .select()
        if (error) {
            console.error('Error adding collection:', error)
            alert('Failed to add collection. Please check if the "collections" table exists.')
            return
        }
        if (newCollection) {
            setData(prev => ({ ...prev, collections: [...prev.collections, newCollection[0]] }))
        }
    }

    const updateCollection = async (id, updates) => {
        const { error } = await supabase
            .from('collections')
            .update(updates)
            .eq('id', id)
        if (error) {
            console.error('Error updating collection:', error)
            alert('Failed to update collection.')
            return
        }
        setData(prev => ({
            ...prev,
            collections: prev.collections.map(col => col.id === id ? { ...col, ...updates } : col)
        }))
    }

    const deleteCollection = async (id) => {
        const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', id)
        if (error) {
            console.error('Error deleting collection:', error)
            alert('Failed to delete collection.')
            return
        }
        setData(prev => ({
            ...prev,
            collections: prev.collections.filter(col => col.id !== id)
        }))
    }

    // Meditations CRUD
    const addMeditation = async (meditation) => {
        const { data: newMeditation, error } = await supabase
            .from('meditations')
            .insert([meditation])
            .select()
        if (error) {
            console.error('Error adding meditation:', error)
            alert('Failed to add meditation. Please check if the "meditations" table exists.')
            return
        }
        if (newMeditation) {
            setData(prev => ({ ...prev, meditations: [...prev.meditations, newMeditation[0]] }))
        }
    }

    const updateMeditation = async (id, updates) => {
        const { error } = await supabase
            .from('meditations')
            .update(updates)
            .eq('id', id)
        if (error) {
            console.error('Error updating meditation:', error)
            alert('Failed to update meditation.')
            return
        }
        setData(prev => ({
            ...prev,
            meditations: prev.meditations.map(med => med.id === id ? { ...med, ...updates } : med)
        }))
    }

    const deleteMeditation = async (id) => {
        const { error } = await supabase
            .from('meditations')
            .delete()
            .eq('id', id)
        if (error) {
            console.error('Error deleting meditation:', error)
            alert('Failed to delete meditation.')
            return
        }
        setData(prev => ({
            ...prev,
            meditations: prev.meditations.filter(med => med.id !== id)
        }))
    }

    // Episodes CRUD
    const addEpisode = async (episode) => {
        const { data: newEpisode, error } = await supabase
            .from('episodes')
            .insert([episode])
            .select()
        if (error) {
            console.error('Error adding episode:', error)
            alert('Failed to add episode.')
            return
        }
        if (newEpisode) {
            setData(prev => ({ ...prev, episodes: [...prev.episodes, newEpisode[0]] }))
        }
    }

    const updateEpisode = async (id, updates) => {
        const { error } = await supabase
            .from('episodes')
            .update(updates)
            .eq('id', id)
        if (error) {
            console.error('Error updating episode:', error)
            alert('Failed to update episode.')
            return
        }
        setData(prev => ({
            ...prev,
            episodes: prev.episodes.map(epi => epi.id === id ? { ...epi, ...updates } : epi)
        }))
    }

    const deleteEpisode = async (id) => {
        const { error } = await supabase
            .from('episodes')
            .delete()
            .eq('id', id)
        if (error) {
            console.error('Error deleting episode:', error)
            alert('Failed to delete episode.')
            return
        }
        setData(prev => ({
            ...prev,
            episodes: prev.episodes.filter(epi => epi.id !== id)
        }))
    }

    // Miracles CRUD
    const addMiracle = async (miracle) => {
        const { data: newMiracle, error } = await supabase
            .from('miracles')
            .insert([miracle])
            .select()
        if (error) {
            console.error('Error adding miracle:', error)
            alert('Failed to add miracle. Please check if the "miracles" table exists.')
            return
        }
        if (newMiracle) {
            setData(prev => ({ ...prev, miracles: [...prev.miracles, newMiracle[0]] }))
        }
    }

    const updateMiracle = async (id, updates) => {
        const { error } = await supabase
            .from('miracles')
            .update(updates)
            .eq('id', id)
        if (error) {
            console.error('Error updating miracle:', error)
            alert('Failed to update miracle.')
            return
        }
        setData(prev => ({
            ...prev,
            miracles: prev.miracles.map(mir => mir.id === id ? { ...mir, ...updates } : mir)
        }))
    }

    const deleteMiracle = async (id) => {
        const { error } = await supabase
            .from('miracles')
            .delete()
            .eq('id', id)
        if (error) {
            console.error('Error deleting miracle:', error)
            alert('Failed to delete miracle.')
            return
        }
        setData(prev => ({
            ...prev,
            miracles: prev.miracles.filter(mir => mir.id !== id)
        }))
    }


    const value = {
        data,
        loading,
        // Categories
        addCategory,
        updateCategory,
        deleteCategory,
        // Collections
        addCollection,
        updateCollection,
        deleteCollection,
        // Meditations
        addMeditation,
        updateMeditation,
        deleteMeditation,
        // Episodes
        addEpisode,
        updateEpisode,
        deleteEpisode,
        // Miracles
        addMiracle,
        updateMiracle,
        deleteMiracle,
        // Search
        searchQuery,
        setSearchQuery
    }

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>

}

