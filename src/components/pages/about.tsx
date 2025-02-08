'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Code, Zap, Globe, BookOpen, Users, Mail, Github, MapPin } from 'lucide-react'

const FeatureCard = ({ title, description, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Card className="h-full bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-lg">
      <CardHeader>
        <Icon className="w-8 h-8 mb-2 text-primary" />
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
)

const StatCard = ({ value, label }) => (
  <Card className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
    <motion.h3 
      className="text-4xl font-bold text-primary"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.h3>
    <p className="text-gray-600">{label}</p>
  </Card>
)

export default function About() {
  const teamMembers = [
    { name: "Alice Johnson", role: "Founder & CEO", avatar: "/placeholder.svg?height=100&width=100" },
    { name: "Bob Smith", role: "CTO", avatar: "/placeholder.svg?height=100&width=100" },
    { name: "Carol Williams", role: "Lead Developer", avatar: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Hero Section */}
          <motion.section 
            className="text-center mb-16"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
              Welcome to DevJourney
            </h1>
            <p className="text-2xl text-gray-600">
              Empowering developers to master coding challenges and grow their skills
            </p>
          </motion.section>

          {/* Mission Statement */}
          <Card className="bg-gray-50 border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700">
                DevJourney is dedicated to providing a comprehensive platform for developers 
                to enhance their problem-solving abilities, master algorithms, and prepare 
                for technical interviews. We believe in learning through practice and 
                community support.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard 
              title="Practice Problems" 
              description="Access a vast collection of coding problems across different difficulty levels."
              icon={Code}
            />
            <FeatureCard 
              title="Real-time Testing" 
              description="Test your solutions instantly with our integrated testing system."
              icon={Zap}
            />
            <FeatureCard 
              title="Multiple Languages" 
              description="Code in your preferred programming language. We support multiple popular languages."
              icon={Globe}
            />
            <FeatureCard 
              title="Learning Resources" 
              description="Access comprehensive explanations, solution approaches, and best practices."
              icon={BookOpen}
            />
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-3 gap-6 my-16">
            <StatCard value="1000+" label="Coding Problems" />
            <StatCard value="50K+" label="Active Users" />
            <StatCard value="10+" label="Languages Supported" />
          </div>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-bold mb-12 text-center text-primary">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <motion.div key={member.name} whileHover={{ y: -10 }}>
                  <Card className="bg-white border border-gray-200 shadow-lg">
                    <CardHeader>
                      <Avatar className="w-24 h-24 mx-auto mb-4 ring-2 ring-primary">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-center text-xl">{member.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-center text-gray-600">{member.role}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <Card className="mt-16 bg-gray-50 border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Get in Touch</CardTitle>
              <CardDescription className="text-gray-600">
                Have questions or feedback? We'd love to hear from you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="text-primary" />
                  <p className="text-gray-700">contact@devjourney.com</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="text-primary" />
                  <p className="text-gray-700">github.com/devjourney</p>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="text-primary" />
                  <p className="text-gray-700">Silicon Valley, CA</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
