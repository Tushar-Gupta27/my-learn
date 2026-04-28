process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  console.log(`You typed: ${input}`);
  if (input === 'exit') process.exit();
});



