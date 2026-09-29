/* What the Leadership section and the Experience roles share: the photo
   shape every gallery renders, the award photo, the merger story's three
   beats, and the event that opens a role's full story from anywhere. */

export type Photo = { src: string; alt: string; caption: string };

export const awardPhoto: Photo = {
  src: "/award.jpg",
  alt: "Adelaide University Sport Club of the Year cheque presentation",
  caption: "Club of the Year · Adelaide University Sport, 2025",
};

export const mergerStory = [
  {
    label: "Setup",
    text: "Adelaide and UniSA were merging, so every affiliated club had to merge too. I was president of the club that was ahead on membership and results, so I ran our side of it. That meant recruiting and bringing the right people across, aligning two committees that each ran their own social and competitive tennis, leading the merged constitution, and keeping every stakeholder comfortable, the University most of all, with as few conflicts as possible.",
  },
  {
    label: "What I did",
    text: "I started by working through what each committee actually wanted and where the two overlapped, then led the merged constitution until both sides were happy to sign it. The hardest piece was the coaches. They were two independent businesses, each loyal to a different club, and any shared model had to close the gaps where money could quietly leak out of the club. We talked through several models over a lot of meetings and settled on a three-month trial with both coaches running sessions together, so the real problems would surface early and we could fix them before locking anything in. Alongside that I ran member feedback to keep people bought into the change, and took on the practical handover myself: the facilities, the nets and fencing, the spare rackets, and the full asset register.",
  },
  {
    label: "Result",
    text: "One merged club running smoothly, both coaches retained on a model that actually worked, the members kept happy through the transition, and Club of the Year in the same year.",
  },
];

export const STORY_EVENT = "story:open";
export type StoryRequest = { id: string; from: HTMLElement | null };

/* Opens a role's full story, growing it out of `from`. */
export function openStory(id: string, from: HTMLElement | null) {
  window.dispatchEvent(new CustomEvent<StoryRequest>(STORY_EVENT, { detail: { id, from } }));
}
