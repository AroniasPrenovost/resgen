
import { ClipboardList, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
 return (
   <article className="min-h-screen bg-gray-50">
     <header>
       <Heading
         title="..."
         description="..."
         icon={ClipboardList}
         iconColor="text-blue-700"
         bgColor="bg-gray-700/10"
       />
     </header>
     <section className="px-8 lg:px-16 py-0 space-y-6">
       <h2 className="text-2xl font-bold text-gray-800">...</h2>
       <p className="text-gray-700 custom_html">
         ...
       </p>

       <h2 className="text-2xl font-bold text-gray-800">...</h2>
       <p className="text-gray-700 custom_html">
         ...
       </p>

       <h2 className="text-2xl font-bold text-gray-800">...</h2>
       <ul className="list-disc pl-5 space-y-2 text-gray-700">
         <li className="custom_html"><strong>...</strong> ...</li>
         <li className="custom_html"><strong>...</strong> ...</li>
         <li className="custom_html"><strong>...</strong> ...</li>
         <li className="custom_html"><strong>...</strong> ...</li>
         <li className="custom_html"><strong>...</strong> ...</li>
       </ul>

       <h2 className="text-2xl font-bold text-gray-800">...</h2>
       <p className="text-gray-700 custom_html">
         ...
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p><strong>...</strong> ...</p>
         <p><strong>...</strong> ...</p>
         <p><strong>...</strong> ...</p>
         <p><strong>...</strong> ...</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">...</h2>
       <p className="text-gray-700 custom_html">
         ...
       </p>

       <div className="border-l-4 border-blue-700 pl-4 text-gray-700 space-y-2">
         <p className="custom_html"><strong>...</strong> ...</p>
         <p className="custom_html"><strong>...</strong> ...</p>
       </div>

       <h2 className="text-2xl font-bold text-gray-800">...</h2>
       <p className="text-gray-700 custom_html">
         ...
       </p>
     </section>
     <footer className="bg-gray-100 p-6 mt-8">
       <div className="flex items-center space-x-2">
         <div className="relative h-8 w-8 mr-4">
           <User className="w-8 h-8 text-gray-800" />
         </div>
         <div>
           <p className="text-lg font-medium text-gray-800">...</p>
           <p className="text-sm text-gray-600 font-small">...</p>
           <p className="text-gray-600 pt-2">
             ...
           </p>
         </div>
       </div>
     </footer>
   </article>
 );
}

export default BlogDetailPage;
