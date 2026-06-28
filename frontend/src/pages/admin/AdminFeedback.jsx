import { useState, useEffect } from 'react';
import { FiStar, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { feedbackAPI } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const StarDisplay = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FiStar key={s} className={`w-4 h-4 ${s <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill={s <= value ? 'currentColor' : 'none'} />
    ))}
  </div>
);

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackAPI.getAll()
      .then(({ data }) => setFeedbacks(data.data || []))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const avg = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.overall, 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Feedback</h1>
          <div className="bg-white rounded-xl shadow px-6 py-3 flex items-center gap-3">
            <FiStar className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{avg}</p>
              <p className="text-xs text-gray-500">{feedbacks.length} reviews</p>
            </div>
          </div>
        </div>

        {feedbacks.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiStar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No feedback yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{fb.user?.name || 'Customer'}</p>
                    <p className="text-sm text-gray-500">{fb.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Order #{fb.order?._id?.slice(-8)} · {fb.order?.createdAt ? new Date(fb.order.createdAt).toLocaleDateString('en-IN') : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <StarDisplay value={fb.overall} />
                    <p className="text-sm text-gray-500 mt-1">Overall: {fb.overall}/5</p>
                    {fb.wouldRecommend !== undefined && (
                      <span className={`inline-flex items-center gap-1 text-xs mt-1 ${fb.wouldRecommend ? 'text-green-600' : 'text-red-500'}`}>
                        {fb.wouldRecommend ? <FiThumbsUp /> : <FiThumbsDown />}
                        {fb.wouldRecommend ? 'Would recommend' : 'Would not recommend'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Aspect ratings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {Object.entries(fb.ratings || {}).map(([key, val]) => val > 0 && (
                    <div key={key} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-500 capitalize mb-1">{key}</p>
                      <StarDisplay value={val} />
                    </div>
                  ))}
                </div>

                {fb.comment && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 italic">"{fb.comment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
