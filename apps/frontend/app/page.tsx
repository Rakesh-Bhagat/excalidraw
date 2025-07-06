"use client";
import FeatureCard from "@/components/FeatureCard";
import Navbar from "@/components/Navbar";
import { SketchyBox } from "@/components/SketchyBox";
import {
  ArrowRight,
  Clock,
  Expand,
  Palette,
  Pencil,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('')

  const handleRoomCode = () =>{
    router.push(`/room/${roomCode}`)
  }
  return (
    <div className="min-h-screen bg-gray-900 font-mono">
      <Navbar />
      <section id="hero" className=" container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="inline-block bg-blue-500/20 px-4 py-2 rounded-lg text-blue-300 text-sm border border-blue-500/30 mb-6 font-mono">
              {" "}
              ✨ Real-time collaborative drawing platform
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl  font-bold text-white mb-8 animate-float">
            Draw Ideas <span className="text-blue-400 relative">Together</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
            The ultimate sketchy canvas for teams. Brainstorm, wireframe, and
            visualize ideas in real-time with your team
          </p>

          <div className="bg-gray-800 p-8 rounded-lg max-w-md mx-auto border-2 border-dashed border-gray-600 mb-16">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Quick Join Room
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                className="h-10 w-full rounded-lg border-2 border-dashed border-gray-500 bg-gray-700 text-white px-3 py-2"
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e)=>setRoomCode(e.target.value)}
              />
              <button className="bg-green-600 px-6 border-2 border-dashed border-green-500 text-white rounded-lg " onClick={handleRoomCode}>
                {" "}
                Join
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 ">
            <Link  href={'/dashboard'} >
            <button className="flex items-center font-semibold font-mono bg-blue-600 text-white px-10 py-4 rounded-xl border-2 border-blue-400 border-dashed text-lg">
              {" "}
              <Sparkles className="mr-3 h-6 w-6" />
              Create New Room <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            </Link>
            <Link href={'/dashboard'}>
            <button className="cursor-pointer flex items-center border-2 border-gray-500 border-dashed px-6 py-4  rounded-lg text-white text-lg font-semibold">
              <Users className="mr-3 h-5 w-5" />
              My Rooms
            </button>
            </Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <h3 className=" text-white text-4xl text-center font-bold mb-4">
          Why Choose SketchFlow?
        </h3>
        <p className="text-lg text-gray-400 max-w-2xl mb-16 text-center mx-auto">
          Built for creative minds who need to collaborate seamlessly
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Sketchy & Natural"
            description="Hand-drawn aesthetic that feels natural and encourages free-flowing creativity"
            SketchBox={<SketchyBox className="w-16 h-16 bg-blue-500 mx-auto" />}
            Icon={
              <Pencil className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            }
          />
          <FeatureCard
            title="Real-time Sync"
            description="See changes instantly as your team draws. Perfect for remote collaboration"
            SketchBox={
              <SketchyBox className="w-16 h-16 bg-green-500 mx-auto" />
            }
            Icon={
              <Users className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            }
          />
          <FeatureCard
            title="Lightning Fast"
            description="Instant room creation with zero lag. Start drawing in seconds"
            SketchBox={
              <SketchyBox className="w-16 h-16 bg-purple-500 mx-auto" />
            }
            Icon={
              <Zap className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            }
          />
          <FeatureCard
            title="Infinite Canvas"
            description="Unlimited space to sketch, explore, and branch ideas freely—without borders."
            SketchBox={
              <SketchyBox className="w-16 h-16 bg-red-500 mx-auto" />
            }
            Icon={
              <Expand  className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            }
          />
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <h3 className="text-4xl text-white text-center font-bold mb-16">
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          <div className="text-center p-4 hover:border-2 border-dashed border-gray-600 rounded-xl">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-blue-400">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-white font-mono">
              Create Room
            </h4>
            <p className="text-gray-400 font-mono">
              Click &quot;Create New Room&quot; and get an instant shareable room code
            </p>
          </div>

          <div className="text-center p-4 hover:border-2 border-dashed border-gray-600 rounded-xl">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-green-400">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-white font-mono">
              Invite Team
            </h4>
            <p className="text-gray-400 font-mono">
              Share the room code with your team members for instant access
            </p>
          </div>

          <div className="text-center p-4 hover:border-2 border-dashed border-gray-600 rounded-xl">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-purple-400">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-white font-mono">
              Start Drawing
            </h4>
            <p className="text-gray-400 font-mono">
              Collaborate in real-time on the infinite sketchy canvas
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-white font-mono">
              Perfect for Every Team
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded border-2 border-dashed border-blue-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 font-mono">
                    Designers & Creatives
                  </h4>
                  <p className="text-gray-400 font-mono">
                    Sketch wireframes, brainstorm concepts, and iterate on
                    designs together
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded border-2 border-dashed border-green-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 font-mono">
                    Remote Teams
                  </h4>
                  <p className="text-gray-400 font-mono">
                    Bridge the distance with visual collaboration that feels
                    natural
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded border-2 border-dashed border-purple-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 font-mono">
                    Agile Teams
                  </h4>
                  <p className="text-gray-400 font-mono">
                    Plan sprints, map user journeys, and visualize complex
                    workflows
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded border-2 border-dashed border-orange-400 flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2 font-mono">
                    Educators
                  </h4>
                  <p className="text-gray-400 font-mono">
                    Teach concepts visually with interactive whiteboard sessions
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative"></div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-20">
        <div className="text-center flex justify-center flex-col bg-gray-800 py-16 px-8 rounded-2xl border-2 border-dashed border-gray-600 max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-6 text-white font-mono">
            Ready to Start Sketching?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using SketchFlow for their visual
            collaboration needs
          </p>
          <button className=" w-xs md:w-sm items-center rounded-xl font-semibold mx-auto flex justify-center bg-blue-600 hover:bg-blue-700 text-white text-md md:text-xl  px-12 py-5 border-2 border-dashed border-blue-500 font-mono transform hover:scale-105 transition-all duration-200">
            <Sparkles className="mr-3 h-6 w-6" />
            Get Started Free
            <ArrowRight className="ml-3 h-6 w-6" />
          </button>
        </div>
      </section>
      <footer className="border-t-2 border-dashed border-gray-600 bg-gray-800 py-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center space-x-3">
        
        <span className="text-xl font-bold text-white font-mono">SketchFlow</span>
      </div>

      <p className="text-sm text-gray-400 font-mono text-center md:text-right">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}
