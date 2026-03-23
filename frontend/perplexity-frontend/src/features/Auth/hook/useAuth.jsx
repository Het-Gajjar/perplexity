import { useDispatch, useSelector } from "react-redux"
import { login, register, getme } from "../services/Auth.api"
import { setUser, setloading, seterror } from "../Auth.slice"

export const useAuth = () => {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)

    const handleLogin = async (email, password) => {
        dispatch(setloading(true))
        try {
            const response = await login(email, password)
            dispatch(setUser(response.user))
            dispatch(setloading(false))
        } catch (error) {
            dispatch(seterror(error))
            dispatch(setloading(false))
        }
    }

    const handleRegister = async (username, email, password) => {
        dispatch(setloading(true))
        try {
            const response = await register(username, email, password)

            dispatch(setloading(false))
        } catch (error) {
            dispatch(seterror(error))
            dispatch(setloading(false))
        }
    }

    const handleGetme = async () => {
        dispatch(setloading(true))
        try {
            const response = await getme()
            dispatch(setUser(response.user))
            dispatch(setloading(false))
        } catch (error) {
            dispatch(seterror(error))
            dispatch(setloading(false))
        }
    }

    return { user, loading, error, handleLogin, handleRegister, handleGetme }
}
