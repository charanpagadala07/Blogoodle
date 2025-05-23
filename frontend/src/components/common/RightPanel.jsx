import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";

const RightPanel = () => {
	const {data:suggestedusers, isLoading} = useQuery({
		queryKey: ["suggestedusers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1/user/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Failed to fetch suggested users");
				}
				return data;
			} catch (error) {
				throw new Error(error.message || "Failed to fetch suggested users");
			}
		}

	})

	const {follow, isPending} = useFollow();

	if(suggestedusers?.length === 0) return <div className="md:w-64 w-0"></div>

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#FAEBD7] p-4 rounded-md sticky top-2'>
				<p className='font-bold mb-5 text-xl text-amber-900'>Suggested</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedusers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profilePic || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate text-[#470700] capitalize w-28'>
											{user.fullname}
										</span>
										<span className='text-sm text-[#ba4a3d]'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-amber-600 hover:bg-amber-400 transition-colors text-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;