"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ChatMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      {/* قائمة المحادثات */}
      <Card className="col-span-4 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">المحادثات النشطة</h3>
          <Badge variant="secondary">15 محادثة</Badge>
        </div>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {/* محتوى المحادثات */}
        </ScrollArea>
      </Card>

      {/* تفاصيل المحادثة */}
      <Card className="col-span-8 p-4">
        <div className="flex flex-col h-full">
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center gap-3">
              <Avatar />
              <div>
                <h4 className="font-semibold">أحمد محمد</h4>
                <p className="text-sm text-gray-500">آخر رسالة: قبل 5 دقائق</p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 mb-4">
            {/* محتوى الرسائل */}
          </ScrollArea>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 rounded-lg border border-gray-200 p-2"
            />
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              إرسال
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}