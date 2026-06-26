import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Heart, Coins, DollarSign, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function ProductCard({ product, index = 0, onLikeUpdate }) {
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setIsLiked(product.liked_by?.includes(userData.email) || false);
      } catch (e) {}
    };
    loadUser();
  }, [product.liked_by]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    
    if (isLiking) return;
    setIsLiking(true);

    const likedBy = product.liked_by || [];
    let newLikedBy;
    let newLikes;

    if (isLiked) {
      newLikedBy = likedBy.filter(email => email !== user.email);
      newLikes = Math.max(0, likesCount - 1);
    } else {
      newLikedBy = [...likedBy, user.email];
      newLikes = likesCount + 1;
    }

    setIsLiked(!isLiked);
    setLikesCount(newLikes);

    await base44.entities.Product.update(product.id, {
      liked_by: newLikedBy,
      likes: newLikes
    });

    // Update favorites in profile
    const profiles = await base44.entities.UserProfile.filter({ user_email: user.email });
    if (profiles.length > 0) {
      const profile = profiles[0];
      const favorites = profile.favorites || [];
      const newFavorites = isLiked 
        ? favorites.filter(id => id !== product.id)
        : [...favorites, product.id];
      await base44.entities.UserProfile.update(profile.id, { favorites: newFavorites });
    }

    setIsLiking(false);
    if (onLikeUpdate) onLikeUpdate();
  };
  const conditionLabels = {
    nuevo: 'Nuevo',
    como_nuevo: 'Como nuevo',
    buen_estado: 'Buen estado',
    usado: 'Usado',
    servicio: 'Servicio'
  };

  const conditionColors = {
    nuevo: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    como_nuevo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    buen_estado: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    usado: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    servicio: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <div>
      <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
        <div className="group luxury-card rounded-lg overflow-hidden transition-all duration-200">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Condition badge */}
            <div className={`absolute top-2 left-2 bg-white px-2 py-1 text-xs font-medium rounded ${
              product.condition === 'nuevo' ? 'text-emerald-600' : 'text-gray-700'
            }`}>
              {conditionLabels[product.condition]}
            </div>

            {/* Like button */}
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all shadow-sm ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="text-gray-900 font-medium text-sm truncate mb-2">{product.title}</h3>
            
            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              {product.price_type === 'ecoins' || product.price_type === 'both' ? (
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-sm">{product.price}</span>
                </div>
              ) : null}
              
              {product.price_type === 'real_money' || product.price_type === 'both' ? (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-gray-600" />
                  <span className="font-semibold text-gray-900 text-sm">{product.real_money_price || product.price}</span>
                </div>
              ) : null}
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Heart className={`w-3 h-3 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{likesCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
