export interface LibraryVideo {
  id: string;
  title: string;
  channel: string;
  bestFor: string;
}

export interface VideoModuleGroup {
  module: string;
  videos: LibraryVideo[];
}

// Video IDs and module mapping from the Startups build plan (section 4). Each ID was checked against YouTube's oEmbed on 2026-10-03.
export const STARTUP_VIDEO_LIBRARY: VideoModuleGroup[] = [
  {
    module: "1. Founder mindset",
    videos: [
      { id: "8VkGRAWmxp0", title: "Entrepreneur Explained in 5 Minutes", channel: "FuseSchool", bestFor: "Explorer, Builder" },
      { id: "nx3GuO41Jyg", title: "Cameron Herold: Let's raise kids to be entrepreneurs", channel: "TED", bestFor: "Explorer, Builder, parents" },
      { id: "UF8uR6Z6KLc", title: "Steve Jobs' 2005 Stanford Commencement Address", channel: "Stanford", bestFor: "All tracks" },
      { id: "qp0HIF3SfI4", title: "How Great Leaders Inspire Action", channel: "TED (Simon Sinek)", bestFor: "Builder, Founder, Operator" },
      { id: "bNpx7gpSqbY", title: "The single biggest reason why start-ups succeed", channel: "TED (Bill Gross)", bestFor: "Founder, Operator" },
    ],
  },
  {
    module: "2. Finding the right problem",
    videos: [
      { id: "Th8JoIan4dg", title: "How to Get and Evaluate Startup Ideas", channel: "Y Combinator", bestFor: "Builder, Founder, Operator" },
    ],
  },
  {
    module: "3. Customer discovery",
    videos: [
      { id: "MT4Ig2uqjTc", title: "How to Talk to Users", channel: "Y Combinator (Eric Migicovsky)", bestFor: "Builder, Founder, Operator" },
    ],
  },
  {
    module: "5. Building the MVP",
    videos: [
      { id: "1hHMwLxN6EM", title: "How to Plan an MVP", channel: "Y Combinator (Michael Seibel)", bestFor: "Builder, Founder, Operator" },
    ],
  },
  {
    module: "6. Business model",
    videos: [
      { id: "oWZbWzAyHAE", title: "Startup Business Models and Pricing", channel: "Y Combinator", bestFor: "Founder, Operator" },
    ],
  },
  {
    module: "7. Marketing and first customers",
    videos: [
      { id: "hyYCn_kAngI", title: "How to Get Your First Customers", channel: "Y Combinator", bestFor: "Builder, Founder, Operator" },
    ],
  },
  {
    module: "8. Money and finance",
    videos: [
      { id: "6DTK9yDP6p0", title: "Setting KPIs and Goals", channel: "Y Combinator", bestFor: "Founder, Operator" },
    ],
  },
  {
    module: "9. Team and leadership",
    videos: [
      { id: "A4SLDQDXdp0", title: "Keys To Successful Co-Founder Relationships", channel: "Y Combinator", bestFor: "Founder, Operator" },
    ],
  },
  {
    module: "11. Pitching and fundraising",
    videos: [
      { id: "17XZGUX_9iM", title: "Kevin Hale: How to Pitch Your Startup", channel: "Y Combinator", bestFor: "Builder, Founder, Operator" },
      { id: "zBUhQPPS9AY", title: "How Startup Fundraising Works", channel: "Y Combinator", bestFor: "Founder, Operator" },
    ],
  },
];
