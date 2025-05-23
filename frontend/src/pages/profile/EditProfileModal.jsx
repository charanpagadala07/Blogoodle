import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useUpdateProfile from "../../hooks/useUpdateProfile";

const EditProfileModal = () => {
	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const {data:authUser} = useQuery({queryKey: ["authUser"] });
	
	const {updateProfile, isUpdatingProfile} = useUpdateProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if(authUser){
			setFormData({
				fullname: authUser.fullname || "",
				username: authUser.username || "",
				email: authUser.email || "",
				bio: authUser.bio || "",
				link: authUser.link || "",
				newPassword: "",
				currentPassword: "",
			});
		}
	},[authUser]);

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm bg-amber-600 hover:bg-amber-300 transition-colors text-white'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border bg-[#FAEBD7] rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-xl my-3 text-amber-900'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 bg-[#fcf7f0] rounded-lg p-3 input-md'
								value={formData.fullname}
								name='fullname'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 bg-[#fcf7f0] rounded-lg p-3  input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 bg-[#fcf7f0] rounded-lg p-3  input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 bg-[#fcf7f0] rounded-lg p-3  input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 bg-[#fcf7f0] rounded-lg p-3  input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 bg-[#fcf7f0] rounded-lg p-3  input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border w-full border-gray-700 bg-[#fcf7f0] rounded-lg p-3  input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn bg-amber-600 hover:bg-amber-300 transition-colors h-10 rounded-full btn-sm text-white'>
							{isUpdatingProfile ? "Updating..." : "Update"}
							</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;