// import Blog from "./Blog";
// import BlogSkeleton from "../skeletons/BlogSkeleton";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";

// const Blogs = ({feedType}) => {
// 	const getBlogEndpoint = () => {
// 		switch (feedType) {
// 			case "foryou":
// 				return "/api/v1/blog/all";
// 			case "following":
// 				return "/api/v1/blog/following";
// 			default:
// 				return "/api/v1/blog/all";
// 		}
// 	};

// 	const BLOG_ENDPOINT = getBlogEndpoint();

// 	const {data: blogs, isLoading, refetch, isRefetching } = useQuery({
// 		queryKey: ["blogs"],
// 		queryFn: async () => {
// 			try {
// 				const res = await fetch(BLOG_ENDPOINT);
// 				const data = await res.json();
// 				if (data.error) return null;
// 				if (!res.ok) {
// 					throw new Error(data.error || "Something went wrong");
// 				}
// 				return data;
// 			} catch (error) {
// 				console.error("Error:", error);
// 				throw error;
				
// 			}
// 		}
// 	});

// 	useEffect(() => {	
// 		refetch();
// 	}
// 	, [feedType, refetch]);

// 	return (
// 		<>
// 			{isLoading || isRefetching && (
// 				<div className='flex flex-col justify-center'>
// 					<BlogSkeleton />
// 					<BlogSkeleton />
// 					<BlogSkeleton />
// 				</div>
// 			)}
// 			{!isLoading && blogs?.length === 0 && <p className='text-center my-4'>No BLOGS in this tab. Switch 👻</p>}
// 			{!isLoading && blogs && (
// 				<div>
// 					{blogs.map((blog) => (
// 						<Blog key={blog._id} blog={blog} />
// 					))}
// 				</div>
// 			)}
// 		</>
// 	);
// };
// export default Blogs;

import Blog from "./Blog";
import BlogSkeleton from "../skeletons/BlogSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Blogs = ({ feedType, username, userId }) => {
    const getBlogEndpoint = () => {
        switch (feedType) {
            case "foryou":
                return "/api/v1/blog/all";
            case "following":
                return "/api/v1/blog/following";
            case "blogs":
                return `/api/v1/blog/user/${username}`; 
            case "likes":
                return `/api/v1/blog/liked/${userId}`;
            default:
                return "/api/v1/blog/all";
        }
    };

    console.log("Current Feed Type:", feedType);

    const BLOG_ENDPOINT = getBlogEndpoint();

    const { data: blogs, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["blogs", feedType, username], // Include feedType in queryKey to refetch on change
        queryFn: async () => {
            try {
                const res = await fetch(BLOG_ENDPOINT);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                console.error("Error:", error);
                throw error;
            }
        },
    });

    console.log("Blogs Data:", blogs);

    useEffect(() => {
        refetch();
    }, [feedType, refetch]);

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            )}
            {!isLoading && blogs?.length === 0 && feedType === "following" && (
                <p className='text-center my-4'>You are not following anyone yet. Follow someone to see their blogs!</p>
            )}
            {!isLoading && blogs?.length === 0 && (
                <p className='text-center my-4'>No blogs available in this tab. Check back later!</p>
            )}
            {!isLoading && blogs && blogs.length > 0 && (
                <div>
                    {blogs.map((blog) => (
                        <Blog key={blog._id} blog={blog} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Blogs;