export const Header = () => {
  return (
    <div
      className="flex justify-between items-center px-4 py-2 bg-[#212121] border-b border-gray-700"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="text-sm"></div>
      <div style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <div
          className="flex gap-2"
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        >
          <button
            onClick={() => window.api.windowControls.minimize()}
            className="w-3 h-3 bg-yellow-400 rounded-full hover:brightness-110 cursor-pointer"
            title="Minimizar"
          />
          <button
            onClick={() => window.api.windowControls.maximize()}
            className="w-3 h-3 bg-green-500 rounded-full hover:brightness-110 cursor-pointer"
            title="Maximizar"
          />
          <button
            onClick={() => window.api.windowControls.close()}
            className="w-3 h-3 bg-red-500 rounded-full hover:brightness-110 cursor-pointer"
            title="Cerrar"
          />
        </div>
      </div>
    </div>
  );
};
