import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Blog = ({ blog }) => {
	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();
	const {data:authUser} = useQuery({
		queryKey: ['authUser'],
		// queryFn: async () => {
		// 	const res = await fetch('/api/v1/auth/me'); // Replace with your actual API endpoint
		// 	if (!res.ok) {
		// 		throw new Error('Failed to fetch user data');
		// 	}
		// 	return res.json();
		// },
	})
	const blogOwner = blog.user;
	const isLiked = blog.likes.includes(authUser._id);

	const {mutate: deleteBlog, isPending:isDeleting} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/v1/blog/${blog._id}`, {
					method: "DELETE",
				});
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;				
			} catch (error) {
				throw new Error(error);
				
			}
		},
		onSuccess: () => {
			toast.success("Blog deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	})


	const {mutate:likepost, isLiking} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/v1/blog/like/${blog._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;				
			} catch (error) {
				throw new Error(error);
				
			}
		},
		onSuccess: (updatedLikes) => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });	
			queryClient.setQueryData(["blogs"], (oldData) => {
				if (!oldData) return [];
				return oldData.map((b) => {
					if (b._id === blog._id) {
						return { ...b, likes: updatedLikes };
					}
					return b;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		}
	})

	const {mutate:commentOnBlog, isPending: isCommenting} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/v1/blog/comment/${blog._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;				
			} catch (error) {
				throw new Error(error);
				
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			setComment("");
			toast.success("Comment added successfully");
			queryClient.setQueryData(["blogs"], (oldData) => {
				if (!oldData) return [];
				return oldData.map((b) => {
					if (b._id === blog._id) {
						return { ...b, comments: [...b.comments, { text: comment, user: authUser }] };
					}
					return b;
				});
			});	
		},
		onError: (error) => {
			toast.error(error.message);
		}
	});


	const isMyBlog = authUser._id === blog.user._id;

	const formattedDate = formatPostDate(blog.createdAt);

	const handleDeleteBlog = () => {
		deleteBlog();
	};

	const handleBlogComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentOnBlog();
	};

	const handleLikeBlog = () => {
		if (isLiking) return;
		likepost();
	};

	return (
		<>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${blogOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={blogOwner.profilePic || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${blogOwner.username}`} className='font-bold'>
							{blogOwner.fullname}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${blogOwner.username}`}>@{blogOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyBlog && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeleteBlog} />}
								{isDeleting && (
									<LoadingSpinner size="sm" />
								)}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{blog.content}</span>
						{blog.img && (
							<img
								src={blog.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + blog._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{blog.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${blog._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{blog.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{blog.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profilePic || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullname}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handleBlogComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? (
												<LoadingSpinner size='sm' />
											) : (
												"post"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							<div className='flex gap-1 items-center group cursor-pointer'>
								<BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
								<span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikeBlog}>
								{isLiking && <LoadingSpinner size='sm' />}
								{(!isLiked && !isLiking) && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

								<span
									className={`text-sm  group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{blog.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Blog;