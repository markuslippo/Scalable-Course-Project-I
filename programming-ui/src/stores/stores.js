import { writable, readable, derived } from 'svelte/store';

let user = localStorage.getItem("userUuid");

if (!user) {
  user = crypto.randomUUID().toString();
  localStorage.setItem("userUuid", user);
}

export const userUuid = readable(user);
export const assignment = writable({ id: '', title: '', assignment_order: 0, handout: '', test_code: '' });
export const feedback = writable(``);
export const pending = writable(false);
export const gradingResult = writable(null);
export const points = derived(
  [assignment, gradingResult],
  ([$assignment, $gradingResult]) => {
      let points = 0;
      if ($assignment.assignment_order === 1 && $gradingResult === true) {
          points = 100; 
      } else if ($assignment.assignment_order > 1) {
          points = ($assignment.assignment_order - 1) * 100;
          if ($gradingResult === true) {
              points += 100;
          }
      }
      return points;
  },
  0 
);