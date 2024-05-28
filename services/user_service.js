const dataSource = [
  { id: 1, name: 'Johnny Depp', rank: 4, rewards: 49 },
  { id: 2, name: 'Brad Pitt', rank: 5, rewards: 33 },
  { id: 3, name: 'Tom Cruise', rank: 1, rewards: 89 },
  { id: 4, name: 'Mel Gibson', rank: 2, rewards: 67 },
  { id: 5, name: 'Robin Williams', rank: 3, rewards: 62 },
];

function getUsers() {
  return [...dataSource];
}

module.exports = {
  getUsers,
};
