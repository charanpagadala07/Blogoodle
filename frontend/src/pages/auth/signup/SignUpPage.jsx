import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


const SignUpPage = () => {

	const queryClient = useQueryClient();
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullname: "",
		password: "",
	});

	const {mutate, isError, isPending, error} = useMutation({
		mutationFn: async ({email, username, fullname, password}) => {
			try {
				const res = await fetch("/api/v1/auth/sign-up", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullname, password }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return data;
			} catch (error) {
				console.error("Error:", error);
				toast.error(error.message);
			}
		},
		onSuccess: ()=>{
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='min-w-screen min-h-screen mx-auto flex gap-3 px-38'>
			<div className='flex-1 hidden lg:flex items-center w-500 justify-center'>
				<img src="/logo.png" alt="Logo" className="" />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center ml-15'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 md:w-400 flex-col' onSubmit={handleSubmit}>
					<img src="/logo.png" alt="Logo" className="w-24 lg:hidden"/>
					<h1 className='text-4xl font-extrabold text-amber-900'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex-col gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 mb-3.5 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullname'
								onChange={handleInputChange}
								value={formData.fullname}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full bg-amber-600 hover:bg-amber-300 transition-colors text-white lg:w-80'>
						{isPending ? "Signing up..." : "Sign up"}
					</button>
					{isError && <p className='text-red-700'>{error?.message || "Something went wrong"}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-amber-700 text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full text-black bg-amber-100 hover:bg-amber-200 transition-colors border border-amber-800 lg:w-80 w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;