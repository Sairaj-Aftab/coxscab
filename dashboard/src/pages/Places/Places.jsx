import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataTable from "react-data-table-component";

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });
  const [editingId, setEditingId] = useState(null);

  const addPlace = () => {
    if (
      newPlace.name &&
      !isNaN(newPlace.latitude) &&
      !isNaN(newPlace.longitude)
    ) {
      setPlaces([...places, { ...newPlace, id: Date.now() }]);
      setNewPlace({ name: "", latitude: 0, longitude: 0 });
    }
  };

  const updatePlace = () => {
    if (editingId !== null) {
      setPlaces(
        places.map((place) =>
          place.id === editingId ? { ...newPlace, id: editingId } : place
        )
      );
      setEditingId(null);
      setNewPlace({ name: "", latitude: 0, longitude: 0 });
    }
  };

  const deletePlace = (id) => {
    setPlaces(places.filter((place) => place.id !== id));
  };

  const startEditing = (place) => {
    setEditingId(place.id);
    setNewPlace({
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
    });
  };
  const columns = [
    // {
    //   name: "#",
    //   selector: (data, index) =>
    //     calculateItemIndex(pageGarage, limitGarage, index),
    //   width: "60px",
    // },

    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Latitude",
      selector: (row) => row.latitude,
      sortable: true,
    },
    {
      name: "Longitude",
      selector: (row) => row.longitude,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <Button
            variant="outline"
            className="mr-2"
            onClick={() => startEditing(row)}
          >
            Edit
          </Button>
          <Button variant="destructive" onClick={() => deletePlace(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="my-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Places</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-1">
              {editingId ? "Edit Place" : "Add New Place"}
            </h2>
            <div className="flex space-x-2 items-end">
              <label htmlFor="name">
                Name
                <Input
                  id="name"
                  placeholder="Name"
                  value={newPlace.name}
                  onChange={(e) =>
                    setNewPlace({ ...newPlace, name: e.target.value })
                  }
                />
              </label>
              <label htmlFor="lat">
                Latitude
                <Input
                  id="lat"
                  type="number"
                  placeholder="Latitude"
                  value={newPlace.latitude}
                  onChange={(e) =>
                    setNewPlace({
                      ...newPlace,
                      latitude: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
              <label htmlFor="lon">
                Longitude
                <Input
                  id="lon"
                  type="number"
                  placeholder="Longitude"
                  value={newPlace.longitude}
                  onChange={(e) =>
                    setNewPlace({
                      ...newPlace,
                      longitude: parseFloat(e.target.value),
                    })
                  }
                />
              </label>
              <Button onClick={editingId ? updatePlace : addPlace}>
                {editingId ? "Update" : "Add"}
              </Button>
            </div>
          </div>
          {/* <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {places.map((place) => (
                  <TableRow key={place.id}>
                    <TableCell>{place.name}</TableCell>
                    <TableCell>{place.latitude}</TableCell>
                    <TableCell>{place.longitude}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="mr-2" onClick={() => startEditing(place)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => deletePlace(place.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          <DataTable
            columns={columns}
            data={places}
            responsive
            // progressPending={getGarageLoading || garageFetching}
            // progressComponent={
            //   <div className="h-[50vh] flex items-center justify-center">
            //     <LoadingComponent loader={getGarageLoading || garageFetching} />
            //   </div>
            // }
            pagination
            paginationServer
            // paginationTotalRows={garages?.totalGarage}
            // onChangeRowsPerPage={handlePerRowsChangeGarage}
            // onChangePage={handlePageChangeGarage}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 125, 150, 175, 200]}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Places;
