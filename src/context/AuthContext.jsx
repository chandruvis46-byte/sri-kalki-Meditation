import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
            if (session?.user) {
                await fetchUserRole(session.user.id)
            } else {
                setLoading(false)
            }
        }

        getSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                await fetchUserRole(session.user.id)
            } else {
                setRole(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchUserRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching role:', error)
            }

            // Default to 'admin' if no profile found (or handle as needed)
            // For now, let's assume if they can login, they differ by role in profiles
            setRole(data?.role || 'admin')
        } catch (error) {
            console.error('Error in fetchUserRole:', error)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return data
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
        setRole(null)
    }

    // Function to create a new user (Super Admin only)
    // Note: This requires a backend function or service role key in a real secure app.
    // We will simulate the call or use a Supabase Function if available.
    const createSubAdmin = async (email, password, role = 'admin') => {
        // Placeholder for edge function call
        // const { data, error } = await supabase.functions.invoke('create-user', {
        //     body: { email, password, role }
        // })

        // For now, we help the user by just returning a message that they need the backend
        // or we try to use the invite api if configured

        // Return a specific error to UI to handle explaining the backend requirement
        return { error: { message: `Creating users (${role}) requires a backend Edge Function. Please deploy the 'create-user' function first.` } }
    }

    const value = {
        user,
        role,
        login,
        logout,
        createSubAdmin,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
