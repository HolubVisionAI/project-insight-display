import {useMutation} from "@tanstack/react-query";
import {loginApi, StoredAuth} from "@/api/auth";
import {useAuth} from "@/hooks/useAuth";

export function useLogin() {
    const {login} = useAuth();

    return useMutation<
        StoredAuth,                        // the mutation returns StoredAuth
        Error,                             // error type
        { email: string; password: string } // variables you pass to mutate()
    >({
        mutationFn: ({email, password}) =>
            loginApi(email, password),
        onSuccess: (authData) => {
            // Persist into React context (and localStorage via the hook)
            login(authData);
        },
    });
}
