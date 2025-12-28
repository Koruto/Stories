import data from "./data.json";
import type { Post } from "./types";

export default function Posts() {
  const dummyPost: Post = data.dummyPost;

  return (
    <div className="w-full bg-gray-500">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-white mb-4 pb-4">
          <div className="flex items-center gap-3 p-3">
            <img
              src={dummyPost.avatar}
              alt={dummyPost.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold text-black">
              {dummyPost.username}
            </span>
          </div>
          <div className="w-full aspect-square bg-gray-200">
            <img
              src={dummyPost.image}
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-3 pt-2">
            <div className="flex gap-4 mb-2">
              <button className="text-black">❤️</button>
              <button className="text-black">💬</button>
              <button className="text-black">📤</button>
            </div>
            <p className="text-black font-semibold mb-1">
              {dummyPost.likes} likes
            </p>
            <p className="text-black">
              <span className="font-semibold">{dummyPost.username}</span>{" "}
              {dummyPost.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
