import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';


const useFollow = () => {
  const queryClient = useQueryClient();

  const {mutate:follow, isPending} = useMutation({
    mutationFn:async (userId) => {
        try {
            const res = await fetch(`/api/v1/user/connect/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json();
            if(!res.ok) {
                throw new Error(data.error || "Failed to follow user")
            }
            return data;
        } catch (error) {
            throw new Error(error.message || "Failed to follow user")
        }
    },
    onSuccess: () => {
        // toast.success(data.message || "Followed successfully");
        Promise.all([
            queryClient.invalidateQueries({queryKey: ["authUser"]}),
            queryClient.invalidateQueries({queryKey: ["suggestedusers"]})
        ])
    },
    onError: (error) => {
        toast.error(error.message || "Failed to follow user")
    }
  });

  return {follow, isPending};
}

export default useFollow
