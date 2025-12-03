import { X } from 'lucide-react';

const StudentDetailModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Student Details</h3>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 space-y-4">
                        {/* Basic Info */}
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl text-indigo-600 font-bold">
                                    {student.user?.name?.charAt(0) || 'S'}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">{student.user?.name || 'N/A'}</h4>
                                <p className="text-sm text-gray-500">{student.user?.email || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Academic Details */}
                        <div className="border-t pt-4">
                            <h5 className="font-semibold text-gray-900 mb-3">Academic Information</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Batch</p>
                                    <p className="font-medium">{student.batch || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Branch</p>
                                    <p className="font-medium">{student.branch || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Course</p>
                                    <p className="font-medium">{student.course || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Roll Number</p>
                                    <p className="font-medium">{student.rollNumber || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        {student.skills && student.skills.length > 0 && (
                            <div className="border-t pt-4">
                                <h5 className="font-semibold text-gray-900 mb-3">Skills</h5>
                                <div className="flex flex-wrap gap-2">
                                    {student.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="border-t pt-4">
                            <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{student.user?.email || 'N/A'}</p>
                                </div>
                                {student.phone && (
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{student.phone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;
