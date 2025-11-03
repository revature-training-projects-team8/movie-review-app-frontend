import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  TrashIcon, 
  ListBulletIcon, 
  PencilSquareIcon,
  FilmIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Dashboard = ({ movies, reviews, loading }) => {
  const [localMovies, setLocalMovies] = useState([]);
  const [localReviews, setLocalReviews] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {
      if (movies) {
        setLocalMovies(movies);
      }
    }, [movies]);

    useEffect(() => {
      if (reviews) {
        setLocalReviews(reviews);
      }
    }, [reviews]);

  const dashboardItems = [
    {
      id: 'add-movie',
      title: 'Add Movie',
      description: 'Add a new movie to the database',
      icon: PlusIcon,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/add-movie')
    },
    {
      id: 'list-movies',
      title: 'List Movies',
      description: 'View all movies in the database',
      icon: ListBulletIcon,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/manage-movies')
    },
    {
      id: 'update-movie',
      title: 'Update Movie',
      description: 'Edit existing movie information',
      icon: PencilSquareIcon,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => navigate('/manage-movies')
    },
    {
      id: 'delete-movie',
      title: 'Delete Movie',
      description: 'Remove movies from the database',
      icon: TrashIcon,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => navigate('/manage-movies')
    }
  ];

  const statsCards = [
    {
      title: 'Total Movies',
      value: localMovies.length,
      icon: FilmIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Total Reviews',
      value: localReviews.length,
      icon: ChartBarIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Average Reviews/Movie',
      value: (localReviews.length / localMovies.length).toFixed(1),
      icon: ChartBarIcon,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Movie Dashboard
          </h1>
          {/* <p className="text-gray-600 text-lg">
            Manage your movie database with ease
          </p> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Movie Management
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={item.action}
                  className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon */}
                    <div className={`p-4 rounded-full ${item.color} transition-colors duration-300`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                      {item.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/add-movie')}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Quick Add Movie
            </button>
            
            <button
              onClick={() => navigate('/manage-movies')}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ListBulletIcon className="h-5 w-5 mr-2" />
              View All Movies
            </button>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
