import { MessageSquare, User } from "lucide-react";
import { Heading } from "@/components/heading";

const BlogDetailPage = async () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Heading
        title="Crafting The Unforgettable Resume: Unlocking The Secrets"
        description="Discover the secrets to creating a memorable resume that stands out from the rest."
        icon={MessageSquare}
        iconColor="text-pink-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-8 lg:px-16 py-0 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
        <p className="text-gray-700">
          Creating a memorable resume is not just about listing your qualifications,
          it is about telling a story that resonates with hiring managers. In this
          post, we shall delve into the artistry involved in crafting a resume that
          leaves an indelible mark.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">The Anatomy of an Unforgettable Resume</h2>
        <p className="text-gray-700">
          What makes a resume unforgettable, you may ask? It is a combination of
          structure, content, and presentation that together create a compelling
          narrative. Here are the key components:
        </p>
        
        <h2 className="text-2xl font-bold text-gray-800">Striking a Balance: Formatting and Design</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Simplicity with Sophistication:</strong> Use a clean layout with subtle design elements. A dash of color, a hint of creative fonts, but keep it professional.</li>
          <li><strong>Consistent and Logical:</strong> Ensure each section flows logically. Use bullet points for readability and maintain consistent formatting throughout.</li>
          <li><strong>White Space is Your Friend:</strong> Avoid clutter. Strategically placed white space enhances readability and makes the overall design more attractive.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-800">The Content: What To Include</h2>
        <p className="text-gray-700">
          Now that the canvas is ready, let us fill it with substance. Here is what your resume must cover:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Career Summary:</strong> A brief, impactful summary that highlights your strengths. Think of it as your elevator pitch.</li>
          <li><strong>Achievements:</strong> Quantifiable achievements that showcase your contributions. Numbers speak volumes.</li>
          <li><strong>Skills:</strong> Showcase both technical and soft skills. Tailor this section to the job you are targeting.</li>
          <li><strong>Professional Experience:</strong> Highlight your most relevant roles. Focus on responsibilities and achievements that align with the job description.</li>
          <li><strong>Education and Certifications:</strong> Include relevant qualifications and ongoing certifications to demonstrate your commitment to professional development.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-800">Artful Language: Choosing Your Words Wisely</h2>
        <p className="text-gray-700">
          Your choice of words should paint a picture of your professional journey. Here are some tips on polishing your prose:
        </p>
        
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Active Voice:</strong> Use active verbs to convey action and accomplishment. “Led,” “Developed,” and “Increased” are your friends.</li>
          <li><strong>Keywords:</strong> Incorporate industry buzzwords and jargon relevant to the job. This also helps with applicant tracking systems (ATS).</li>
          <li><strong>Conciseness:</strong> Be brief but impactful. Each word should add value to your story.</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-800">Conclusion</h2>
        <p className="text-gray-700">
          Crafting an unforgettable resume is an art form that combines design,
          content, and language. By paying attention to these details, you can tell
          a compelling story that showcases your unique qualifications and leaves
          a lasting impression on hiring managers. It is not just a document; it is
          your professional masterpiece.
        </p>
      </div>
      <div className="bg-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2">    
          <div className="relative h-8 w-8 mr-4">
            <User className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-800">Alexis Bonhomme</p>
            <p className="text-sm text-gray-600 font-small">Senior Resume Writer</p>
            <p className="text-gray-600 pt-2">Alexis is a seasoned resume writer with over 12 years of experience. Specializing in transforming mundane resumes into compelling narratives, Alexis helps professionals in various industries land their dream jobs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;