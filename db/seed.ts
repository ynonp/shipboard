import { db } from "./index";
import {
  requestTags,
  requests,
  tags,
  type NewFeatureRequest,
} from "./schema";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const seed: NewFeatureRequest[] = [
  {
    title: "Dark mode",
    description: "Give the board a dark theme that follows the OS setting.",
    author: "Maya",
    status: "shipped",
    votes: 42,
    createdAt: daysAgo(40),
  },
  {
    title: "Slack notifications when a request ships",
    description: "Post to a channel whenever a request moves to Shipped.",
    author: "Daniel",
    status: "planned",
    votes: 31,
    createdAt: daysAgo(21),
  },
  {
    title: "Comments on requests",
    description: "Let teammates discuss a request before we commit to it.",
    author: "Noa",
    status: "planned",
    votes: 27,
    createdAt: daysAgo(18),
  },
  {
    title: "Search and filter the board",
    description: "Filter by status and search titles and descriptions.",
    author: "Amir",
    status: "open",
    votes: 24,
    createdAt: daysAgo(12),
  },
  {
    title: "Tags / labels",
    description: "Group requests by area: billing, onboarding, API, etc.",
    author: "Lior",
    status: "open",
    votes: 19,
    createdAt: daysAgo(9),
  },
  {
    title: "Export to CSV",
    description: "Download the whole board for the quarterly planning meeting.",
    author: "Tamar",
    status: "open",
    votes: 15,
    createdAt: daysAgo(7),
  },
  {
    title: "Merge duplicate requests",
    description: "Combine two requests and keep the votes from both.",
    author: "Yossi",
    status: "open",
    votes: 11,
    createdAt: daysAgo(5),
  },
  {
    title: "Keyboard shortcuts",
    description: "j/k to move between requests, u to upvote.",
    author: "Maya",
    status: "open",
    votes: 8,
    createdAt: daysAgo(3),
  },
  {
    title: "Markdown in descriptions",
    description: "Support lists, links and code blocks in request descriptions.",
    author: "Daniel",
    status: "shipped",
    votes: 22,
    createdAt: daysAgo(30),
  },
  {
    title: "Public roadmap page",
    description: "A read-only page customers can see, showing Planned and Shipped.",
    author: "Noa",
    status: "open",
    votes: 5,
    createdAt: daysAgo(1),
  },
];

db.transaction((tx) => {
  tx.delete(requestTags).run();
  tx.delete(requests).run();
  tx.delete(tags).run();
  tx.insert(requests).values(seed).run();
});

console.log(`Seeded ${seed.length} feature requests.`);
