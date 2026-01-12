import flowbite from "flowbite/plugin";

export default {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./node_modules/flowbite/**/*.js",
  ],
  plugins: [flowbite],
};
