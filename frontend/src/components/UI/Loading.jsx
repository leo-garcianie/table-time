import { Loader2 } from "lucide-react";

const Loading = ({ text }) => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <Loader2 className="size-4 md:size-6 animate-spin text-primary" />
            <span className="text-dark">{text}</span>
        </div>
    );
};

export default Loading;
