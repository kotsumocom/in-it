import { Head } from "$fresh/runtime.ts";

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - 繝壹・繧ｸ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ</title>
      </Head>
      <div class="px-4 py-8 mx-auto bg-[#86efac]">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            class="my-6"
            src="/type.svg"
            width="128"
            height="128"
            alt="in-it 繝ｭ繧ｴ"
          />
          <h1 class="text-4xl font-bold">404 - 繝壹・繧ｸ縺瑚ｦ九▽縺九ｊ縺ｾ縺帙ｓ</h1>
          <p class="my-4">縺頑爾縺励・繝壹・繧ｸ縺ｯ蟄伜惠縺励∪縺帙ｓ縲・/p>
          <a href="/" class="underline">
            繝帙・繝縺ｫ謌ｻ繧・          </a>
        </div>
      </div>
    </>
  );
}
