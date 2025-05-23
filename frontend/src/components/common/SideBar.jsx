import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/v1/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: async () => {
			queryClient.removeQueries({ queryKey: ["authUser"] });
			toast.success("Logout successful");
			navigate("/login");
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});

	const navigatetologin = () => {
		navigate('/login');
		queryClient.invalidateQueries({queryKey:["authUser"]});
	}


	const {data:authUser} = useQuery({
		queryKey:["authUser"],
	});

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<img src="/logo.png" alt="Logo" className="w-24"/>
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
					  <Link
					    to='/'
					    className='group flex gap-3 items-center hover:bg-[#ffd7a1] transition-colors rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					  >
					    <MdHomeFilled className='w-8 h-8 text-amber-900 ' />
					    <span className='text-lg text-amber-900  hidden md:block'>
					      Home
					    </span>
					  </Link>
					</li>
					<li className='flex justify-center md:justify-start'>
					  <Link
					    to='/notifications'
					    className='group flex gap-3 items-center hover:bg-[#ffd7a1] transition-colors rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					  >
					    <IoNotifications className='w-8 h-8 text-amber-900 ' />
					    <span className='text-lg text-amber-900  hidden md:block'>
					      Notifications
					    </span>
					  </Link>
					</li>
					
					<li className='flex justify-center md:justify-start'>
					  <Link
					    to={`/profile/${authUser?.username}`}
					    className='group flex gap-3 items-center hover:bg-[#ffd7a1] transition-colors rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
					  >
					    <FaUser className='w-8 h-8 text-amber-900' />
					    <span className='text-lg text-amber-900  hidden md:block'>
					      Profile
					    </span>
					  </Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#ffd7a1] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={authUser?.profilePic || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-[#470700] font-bold text-md w-20 truncate capitalize'>{authUser?.fullname}</p>
								<p className='text-[#ba4a3d] text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer' 
							onClick={(e)=>{
								e.preventDefault();
								logout();
								navigatetologin();
							}} />
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;