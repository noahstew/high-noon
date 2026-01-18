export default function FacebookSDK() {
  return (
    <>
      <div id="fb-root"></div>
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0"
        nonce="random123"
      />
    </>
  );
}
