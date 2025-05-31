import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Player } from '../lib/stores/usePlayersStore';

interface ResultsTableProps {
  players: Player[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ players }) => {
  const getStatusBadge = (status: Player['status']) => {
    switch (status) {
      case 'continuer':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <i className="fas fa-play mr-1"></i>
            Continuer
          </Badge>
        );
      case 'quit':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-700">
            <i className="fas fa-door-open mr-1"></i>
            Quit
          </Badge>
        );
      case 'executed':
        return (
          <Badge className="bg-red-600 hover:bg-red-700">
            <i className="fas fa-times mr-1"></i>
            Executed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <i className="fas fa-user mr-1"></i>
            Unknown
          </Badge>
        );
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <i className="fas fa-crown text-yellow-500 text-xl"></i>;
      case 1:
        return <i className="fas fa-medal text-gray-400 text-lg"></i>;
      case 2:
        return <i className="fas fa-award text-amber-600 text-lg"></i>;
      default:
        return <span className="text-muted-foreground font-bold">{index + 1}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-left font-bold">Rank</TableHead>
            <TableHead className="text-left font-bold">Player Name</TableHead>
            <TableHead className="text-center font-bold">Wins</TableHead>
            <TableHead className="text-center font-bold">Losses</TableHead>
            <TableHead className="text-center font-bold">XP</TableHead>
            <TableHead className="text-center font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow 
              key={player.id} 
              className={`border-border transition-colors hover:bg-muted/20 ${
                index === 0 ? 'bg-yellow-500/10' : ''
              }`}
            >
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  {getRankIcon(index)}
                  {index === 0 && (
                    <span className="text-sm font-semibold text-yellow-500">
                      Winner!
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">{player.name}</span>
                  {index < 3 && (
                    <i className="fas fa-star text-primary text-sm"></i>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <i className="fas fa-trophy text-green-500"></i>
                  <span className="font-bold text-lg">{player.wins}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <i className="fas fa-times text-red-500"></i>
                  <span className="font-bold text-lg">{player.losses}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <i className="fas fa-star text-primary"></i>
                  <span className="font-bold text-lg text-primary">{player.xp}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(player.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultsTable;
