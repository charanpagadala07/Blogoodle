import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const {mutate:updateProfile, isPending:isUpdatingProfile} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch('/api/v1/user/update', {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message);
				}
				return data;				
			} catch (error) {
				console.log("Error:", error);
				throw new Error(error.message || "Failed to update profile");
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			document.getElementById("edit_profile_modal").close();
			queryClient.invalidateQueries({queryKey: ["authUser"]});
			queryClient.invalidateQueries({queryKey: ["userProfile"]});
			queryClient.invalidateQueries({queryKey: ["blogs"]});
			queryClient.invalidateQueries({queryKey: ["user"]});
			console.log("invalidating queries");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update profile");
		}
	}) 

    return {updateProfile, isUpdatingProfile}
}

export default useUpdateProfile
