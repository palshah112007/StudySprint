"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  Trophy,
  Swords,
  UserPlus,
  Search,
  Hash,
  Clock,
  Video,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

const studyGroups = [
  { name: "Calculus Crew", members: 128, active: 12, topic: "Mathematics", color: "primary", online: true },
  { name: "Physics Wizards", members: 89, active: 8, topic: "Physics", color: "amber", online: true },
  { name: "Code Masters", members: 215, active: 24, topic: "CS", color: "purple", online: true },
  { name: "Bio Scholars", members: 67, active: 5, topic: "Biology", color: "accent", online: false },
  { name: "Lit Society", members: 45, active: 3, topic: "Literature", color: "rose", online: false },
];

const friends = [
  { name: "Sarah Chen", status: "Studying", xp: 45800, avatar: "SC", online: true },
  { name: "Marcus Johnson", status: "In Focus Room", xp: 42100, avatar: "MJ", online: true },
  { name: "Emily Rodriguez", status: "Taking Quiz", xp: 38900, avatar: "ER", online: true },
  { name: "Lisa Park", status: "Offline", xp: 11200, avatar: "LP", online: false },
  { name: "James Wilson", status: "Offline", xp: 9800, avatar: "JW", online: false },
];

const activityFeed = [
  { user: "Sarah Chen", action: "completed a", target: "Calculus quiz", xp: 150, time: "2m ago" },
  { user: "Marcus Johnson", action: "earned", target: "Week Warrior achievement", xp: 250, time: "8m ago" },
  { user: "Emily Rodriguez", action: "started a", target: "Physics focus session", xp: 0, time: "15m ago" },
  { user: "Lisa Park", action: "joined", target: "Code Masters group", xp: 75, time: "1h ago" },
  { user: "You", action: "maintained your", target: "12-day streak", xp: 100, time: "2h ago", isUser: true },
];

const challenges = [
  { name: "Weekend Sprint", participants: 234, prize: "500 XP", deadline: "2 days left", color: "primary" },
  { name: "Quiz Battle", participants: 156, prize: "300 XP", deadline: "4 days left", color: "amber" },
  { name: "Group Focus", participants: 89, prize: "750 XP", deadline: "6 days left", color: "accent" },
];

export default function SocialPage() {
  const [showFindFriends, setShowFindFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<string[]>(["Calculus Crew"]);

  const toggleJoinGroup = (name: string) => {
    if (joinedGroups.includes(name)) {
      setJoinedGroups(joinedGroups.filter((g) => g !== name));
      toast(`Left "${name}" study group`, "info");
    } else {
      setJoinedGroups([...joinedGroups, name]);
      toast(`Joined "${name}" study group! 🎉`, "success");
    }
  };

  const filteredGroups = studyGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-primary-500/10">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">Community</h1>
              <p className="text-sm text-surface-400">Study together, achieve together</p>
            </div>
            <Button variant="gradient" size="sm" glow className="ml-auto" onClick={() => setShowFindFriends(true)}>
              <UserPlus className="w-4 h-4" />
              Find Friends
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups, friends, or topics..."
              className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary-400" />
                  Active Study Groups
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => toast("📚 Browse all study groups — 24 groups available across 8 subjects!", "info")}>Browse All</Button>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredGroups.map((group) => (
                    <motion.div
                      key={group.name}
                      whileHover={{ scale: 1.02 }}
                      className="glass-light rounded-xl p-4 cursor-pointer group"
                      onClick={() => toggleJoinGroup(group.name)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              group.online ? "bg-emerald-400" : "bg-surface-500"
                            )}
                          />
                          <span className="text-sm font-medium text-surface-200">{group.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {joinedGroups.includes(group.name) && (
                            <Badge variant="accent" size="sm">
                              <Check className="w-3 h-3" />
                              Joined
                            </Badge>
                          )}
                          <Badge variant={group.color as "primary" | "amber" | "accent" | "purple" | "rose"} size="sm">
                            {group.topic}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-surface-500">
                        <span>{group.members} members</span>
                        <span>{group.active} studying now</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary-400" />
                  Friend Activity
                </CardTitle>
                <Badge variant="primary" size="sm" pulse>Live</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityFeed.map((activity) => (
                  <motion.div
                    key={activity.time + activity.user}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl",
                      activity.isUser && "bg-primary-500/5"
                    )}
                  >
                    <Avatar name={activity.user} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-300">
                        <span className="font-medium text-surface-200">{activity.user}</span>
                        {" "}{activity.action}{" "}
                        <span className="text-primary-300">{activity.target}</span>
                      </p>
                      <p className="text-xs text-surface-500">{activity.time}</p>
                    </div>
                    {activity.xp > 0 && (
                      <Badge variant="amber" size="sm">+{activity.xp} XP</Badge>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Live Study Rooms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-400" />
                  Live Study Rooms
                </CardTitle>
                <Badge variant="rose" size="sm" pulse>3 Active</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "Math Sprint", users: 8, duration: "45:32" },
                    { name: "CS Study Jam", users: 12, duration: "1:15:20" },
                    { name: "Physics Lab", users: 5, duration: "23:45" },
                  ].map((room) => (
                    <motion.button
                      key={room.name}
                      whileHover={{ scale: 1.02 }}
                      className="glass-light rounded-xl p-4 text-center cursor-pointer group"
                      onClick={() => {
                        toast(`🎥 Joining "${room.name}" — ${room.users} students are studying right now!`, "success");
                      }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-sm font-medium text-surface-200">{room.name}</p>
                      <div className="flex items-center justify-center gap-3 mt-1 text-xs text-surface-500">
                        <span>{room.users} studying</span>
                        <span>{room.duration}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Friends Online */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-400" />
                  Friends
                </CardTitle>
                <Badge variant="accent" size="sm" pulse>3 Online</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.name}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-800/30 transition-colors cursor-pointer"
                    onClick={() => {
                      if (friend.online) {
                        toast(`💬 Messaging ${friend.name}...`, "info");
                      } else {
                        toast(`${friend.name} is offline. Send them a message?`, "info");
                      }
                    }}
                  >
                    <Avatar name={friend.name} size="sm" status={friend.online ? "online" : "offline"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-200">{friend.name}</p>
                      <p className="text-xs text-surface-500">{friend.status}</p>
                    </div>
                    <span className="text-xs text-surface-500">{friend.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenges.map((challenge) => (
                  <div key={challenge.name} className="glass-light rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-surface-200">{challenge.name}</p>
                      <Badge variant={challenge.color as "primary" | "amber" | "accent"} size="sm">
                        {challenge.prize}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-surface-500">
                      <span>{challenge.participants} participants</span>
                      <span>{challenge.deadline}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card gradient>
              <CardContent>
                <h3 className="text-sm font-semibold text-surface-200 mb-4">Your Community Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: "Study Groups", value: "4", icon: Users },
                    { label: "Friends", value: "28", icon: UserPlus },
                    { label: "Challenges Won", value: "12", icon: Trophy },
                    { label: "Group Sessions", value: "45", icon: Clock },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-surface-400" />
                        <span className="text-sm text-surface-400">{stat.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-surface-200">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Find Friends Modal */}
      <Modal isOpen={showFindFriends} onClose={() => setShowFindFriends(false)} title="Find Friends" size="lg">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search by name, email, or school..."
            className="w-full bg-surface-800/50 border border-surface-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-surface-200 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/30 transition-all"
          />
        </div>
        <div className="space-y-2">
          {[
            { name: "David Park", school: "MIT", mutual: 3, online: true },
            { name: "Sophia Kim", school: "Stanford", mutual: 5, online: true },
            { name: "Ryan Torres", school: "Harvard", mutual: 1, online: false },
            { name: "Maya Patel", school: "Berkeley", mutual: 2, online: true },
          ].map((person) => (
            <div key={person.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/30 transition-colors cursor-pointer"
              onClick={() => {
                toast(`Friend request sent to ${person.name}! 🎉`, "success");
                setShowFindFriends(false);
              }}
            >
              <Avatar name={person.name} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-surface-200">{person.name}</span>
                  {person.online && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </div>
                <p className="text-xs text-surface-500">{person.school} • {person.mutual} mutual friends</p>
              </div>
              <Button variant="gradient" size="sm" glow>Add Friend</Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
