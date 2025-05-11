function Sidebar({ isOpen }) {

    return (
        <>
            <div
                className={`sidebar fixed left-0 h-full w-64 bg-white shadow-lg z-10 
        transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >

                <div className="p-4">
                    <p>No se cerrará si haces clic afuera.</p>
                </div>
            </div>
        </>
    );
}

export default Sidebar