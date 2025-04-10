import Blog from "./Blog";
import BlogSkeleton from "../skeletons/BlogSkeleton";
import { BLOGS } from "../../utils/db/dummy";

const Blogs = () => {
	const isLoading = false;

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<BlogSkeleton />
					<BlogSkeleton />
					<BlogSkeleton />
				</div>
			)}
			{!isLoading && BLOGS?.length === 0 && <p className='text-center my-4'>No BLOGS in this tab. Switch 👻</p>}
			{!isLoading && BLOGS && (
				<div>
					{BLOGS.map((blog) => (
						<Blog key={blog._id} blog={blog} />
					))}
				</div>
			)}
		</>
	);
};
export default Blogs;