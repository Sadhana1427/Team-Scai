"use client";

import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact dispatch / logging
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Card className="bg-emerald-50/50 border-emerald-200 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-emerald-950">Message Sent!</h3>
          <p className="text-sm text-emerald-800 max-w-md">
            Thank you for contacting Team SCAI. Our executive team will review your message and reply to <strong>{formData.email}</strong> shortly.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            className="mt-4"
          >
            Send Another Message
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Maya Chen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="you@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <Input
            label="Subject"
            required
            placeholder="Inquiry / Partnership / Event Query"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />

          <Textarea
            label="Message"
            required
            rows={5}
            placeholder="Write your message or inquiry here..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <Button type="submit" size="md" isLoading={loading} className="w-full sm:w-auto gap-2">
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
