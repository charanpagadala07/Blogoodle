import { useState } from "react";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const queryClient = useQueryClient();

	const {mutate:Loginmutation,isPending,isError,error} = useMutation({
		mutationFn: async ({ username, password }) => {
			try {
				const res = await fetch("/api/v1/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				const data = await res.json();
				if (!res.ok) {	
					throw new Error("Network response was not ok");
				}
				return data;
			} catch (error) {
				console.error("Error:", error);
				toast.error(error.message);
				throw error; 
			}
		},
		onSuccess: () =>{
			toast.success("Login successful");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		Loginmutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl flex h-screen items-center lg:ml-40 gap-15 '>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-100 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center w-4/5 ml-20'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					{/* <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1> */}
					<h1 className='text-4xl font-extrabold text-amber-900'>Welcome Back !!</h1>
					<label className='input input-bordered rounded flex items-center lg:w-80 gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='Username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

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
					<button className='btn rounded-full bg-amber-300'>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-700'>{error?.message || "Something went Wrong"}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-amber-700 text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full text-black bg-amber-100 hover:bg-amber-500 transition-colors border-2 border-amber-800 lg:w-80 w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;