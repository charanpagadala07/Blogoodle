import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
// import onPromise from "promise";
import { BLOGS } from "../../utils/db/dummy";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Blogs from "../../components/common/Blogs";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import useUpdateProfile from "../../hooks/useUpdateProfile";

const ProfilePage = () => {	
	const [coverPic, setcoverPic] = useState(null);
	const [profilePic, setprofilePic] = useState(null);
	const [feedType, setFeedType] = useState("blogs");
	// const queryClient = useQueryClient();
	const coverPicRef = useRef(null);
	const profilePicRef = useRef(null);

	const {username} = useParams();
	console.log("Username:", username);

	const {follow, isPending} = useFollow();

	const {data:authUser} = useQuery({queryKey: ["authUser"] });

	const {data:user, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["user", username],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/v1/user/profile/${username}`,{
					method: "GET",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.message);
				}
				return data;
			} catch (error) {
				console.log("Error:", error);
				throw new Error(error.message);
			}
		},
		onError: (error) => {
			console.log("Error:", error);
		},
	});

	const {updateProfile, isUpdatingProfile} = useUpdateProfile();
	const isMyProfile = authUser._id === user?._id;
	const amiFollowing = authUser?.following?.includes(user?._id);

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverPic" && setcoverPic(reader.result);
				state === "profilePic" && setprofilePic(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const {data: blogs } = useQuery({queryKey: ["blogs"]});
	
	const membersince = formatMemberSinceDate(user?.createdAt);

	useEffect(() => {
		refetch();
	}, [username, refetch] );
	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{( isLoading && isRefetching ) && <ProfileHeaderSkeleton />}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg capitalize text-amber-950'>{user?.fullname}</p>
									<span className='text-sm text-slate-500'>{blogs?.length} </span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverPic || user?.coverPic || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-amber-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverPicRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
                                    accept="image/*"
									hidden
									ref={coverPicRef}
									onChange={(e) => handleImgChange(e, "coverPic")}
								/>
								<input
									type='file'
                                    accept="image/*"
									hidden
									ref={profilePicRef}
									onChange={(e) => handleImgChange(e, "profilePic")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full relative group/avatar'>
										<img src={profilePic || user?.profilePic || "/avatar-placeholder.png"} />
										<div className='absolute top-5 right-3 p-1 bg-amber-800 rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
											{isMyProfile && (
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profilePicRef.current.click()}
												/>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>
								{isMyProfile && <EditProfileModal />}
								{!isMyProfile && (
									<button
										className='btn btn-outline rounded-full btn-sm bg-amber-600 hover:bg-amber-300 transition-colors text-white'
										onClick={() => follow(user?._id)}
									>
										{isPending && "Loading..."}
										{!isPending && amiFollowing && "Unfollow"}
										{!isPending && !amiFollowing && "Follow"}
									</button>
								)}
								{(coverPic || profilePic) && (
									<button
										className='btn btn-primary rounded-full btn-sm bg-amber-600 hover:bg-amber-300 transition-colors text-white px-4 ml-2'
										onClick={() => updateProfile({coverPic, profilePic})}
									>
										{isUpdatingProfile ? "Updating" : "Update"}
		
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-2xl capitalize text-[#470700]'>{user?.fullname}</span>
									<span className='text-md text-[#ba4a3d]'>@{user?.username}</span>
									<span className='text-md my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-700 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>
											{membersince}
										</span>
									</div>
								</div>
								<div className='flex gap-5'>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-sm'>{user?.following.length}</span>
										<span className='text-amber-900 text-sm'>Following</span>
									</div>
									<div className='flex gap-1 items-center'>
										<span className='font-bold text-sm'>{user?.followers.length}</span>
										<span className='text-amber-900 text-sm'>Followers</span>
									</div>
								</div>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-[#ffd7a1] transition-colors duration-300 relative cursor-pointer'
									onClick={() => setFeedType("blogs")}
								>
									Blogs
									{feedType === "blogs" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-amber-600' />
									)}
								</div>
								<div
									className='flex justify-center flex-1 p-3 hover:bg-[#ffd7a1] transition-colors duration-300 relative cursor-pointer'
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-amber-600' />
									)}
								</div>
							</div>
						</>
					)}

					<Blogs feedType={feedType} username={username} userId={user?._id} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;