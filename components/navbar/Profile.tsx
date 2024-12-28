"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Notification } from "iconsax-react";
import { CloseCircle } from "iconsax-react";
import { getUserNotifications } from "../comment/action";
import Link from "next/link";
import { useSeeCommentsSelector } from "@/app/redux/store/hooks";
import { useSeeCommentsDispatch } from "@/app/redux/store/hooks";
import { setSeeCommentsQuery } from "@/app/redux/store/SeeCommentsSlice";

export type notificationsProps = {
  id: number;
  bookId: number;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  userGetReply: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};

export function Profile({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState<
    notificationsProps[]
  >([]);
  const dispatch = useSeeCommentsDispatch();
  const userId = session?.user?.id;

  const isShowComment = useSeeCommentsSelector(
    (state) => state.seeCommentsSlice.showComments
  );

  useEffect(() => {
    if (!userId) return;

    const userNotifications = async () => {
      const notifications = await getUserNotifications(Number(userId));
      console.log(notifications, "notifications");
      setUserNotifications(notifications);
      dispatch(setSeeCommentsQuery({ showComments: false }));
    };
    userNotifications();
  }, [userId, isShowComment]);

  return (
    <>
      {/* Avatar Image */}
      <Image
        id="avatar"
        width={35}
        height={35}
        alt="avatar"
        src={session?.user?.image as string}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      />

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-1/4 h-screen bg-white z-50 shadow-lg animate-slide-in">
          <div className="flex flex-col h-full">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <CloseCircle
                size="24"
                color="#000"
                className="cursor-pointer"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            </div>

            {/* Notifications */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {userNotifications.map((notification, index) => (
                <div className="flex items-center space-x-2" key={index}>
                  <Image
                    alt="avatar"
                    src={notification.user.avatar}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {notification.user.name} replied to you
                    </p>
                    <Link
                      href={`/book/${notification.bookId}/#${notification.id}`}
                      className="text-blue-500 text-sm"
                    >
                      Go there
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popover */}
      {isOpen && (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="hidden" />
          </PopoverTrigger>
          <PopoverContent className="mt-[3rem] p-4 z-10">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
                <div
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="flex relative items-center cursor-pointer"
                >
                  <Notification size="26" color="#000" />
                  <div className="absolute -top-1 left-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-medium text-white">
                    4
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
